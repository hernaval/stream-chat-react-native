import React from 'react';
import { Text, View } from 'react-native';
import { ThemeProvider } from '@stream-io/styled-components';
import { cleanup, render, waitFor } from '@testing-library/react-native';

import { getOrCreateChannelApi } from 'mock-builders/api/getOrCreateChannel';
import { useMockedApis } from 'mock-builders/api/useMockedApis';
import { generateChannel } from 'mock-builders/generator/channel';
import { getTestClientWithUser } from 'mock-builders/mock';

import ChannelListMessenger from '../ChannelListMessenger';

import Chat from '../../Chat/Chat';

import { TranslationContext } from '../../../context';
import { defaultTheme } from '../../../styles/theme';

let mockChannels;
let chatClient;

const t = jest.fn((key) => key);

const Component = ({ channels, error = false, loadingChannels = false }) => (
  <ThemeProvider theme={defaultTheme}>
    <TranslationContext.Provider value={{ t }}>
      <Chat client={chatClient}>
        <ChannelListMessenger
          channels={channels}
          error={error}
          loadingChannels={loadingChannels}
          LoadingIndicator={() => (
            <View testID='loading-indicator'>
              <Text>Loading Indicator</Text>
            </View>
          )}
        />
      </Chat>
    </TranslationContext.Provider>
  </ThemeProvider>
);

describe('ChannelListMessenger', () => {
  beforeAll(async () => {
    chatClient = await getTestClientWithUser({ id: 'vishal' });
    const c1 = generateChannel();
    const c2 = generateChannel();
    useMockedApis(chatClient, [
      getOrCreateChannelApi(c1),
      getOrCreateChannelApi(c2),
    ]);
    const channel1 = chatClient.channel(c1.channel.type, c1.channel.id);
    await channel1.watch();
    const channel2 = chatClient.channel(c2.channel.type, c2.channel.id);
    await channel2.watch();
    mockChannels = [channel1, channel2];
  });
  afterEach(cleanup);

  it('renders without crashing', async () => {
    const { getByTestId } = render(<Component channels={mockChannels} />);
    await waitFor(() => {
      expect(getByTestId('channel-list-messenger')).toBeTruthy();
    });
  });

  it('renders the `EmptyStateIndicator` when no channels are present', async () => {
    const { getByTestId } = render(<Component channels={[]} />);
    await waitFor(() => {
      expect(getByTestId('empty-channel-state')).toBeTruthy();
    });
  });

  it('renders the `LoadingErrorIndicator` when `error` prop is true', async () => {
    const { getByTestId } = render(
      <Component channels={mockChannels} error={true} />,
    );
    await waitFor(() => {
      expect(getByTestId('channel-loading-error')).toBeTruthy();
    });
  });

  it('renders the `LoadingIndicator` when `loadingChannels` prop is true', async () => {
    const { getByTestId } = render(
      <Component channels={mockChannels} loadingChannels={true} />,
    );
    await waitFor(() => {
      expect(getByTestId('loading-indicator')).toBeTruthy();
    });
  });
});
