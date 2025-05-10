import React, { useState } from 'react';

// Simulated ObjectId strings (24-character hex values)
const objectId = (id: string) => id.padStart(24, '0');

const formatTimestamp = (timestamp: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  };
  return new Date(timestamp).toLocaleDateString('en-US', options);
};

const dummyStream = {
  _id: objectId('1'),
  shelterId: objectId('shelter789'),
  title: 'Help Rescue Abandoned Puppies!',
  description: 'Join us live to see the rescued puppies and support their care.',
  streamKey: 'unique-stream-key',
  startTime: new Date(),
  endTime: null,
  isLive: true,
  viewers: 342,
  donations: [
    {
      donorId: objectId('user1'),
      amount: 20,
      message: 'Sending love!',
      timestamp: new Date(),
    },
    {
      donorId: objectId('user2'),
      amount: 50,
      message: 'Hope this helps!',
      timestamp: new Date(),
    },
  ],
  chatMessages: [
    {
      userId: objectId('user1'),
      message: 'They’re so cute!',
      timestamp: new Date(),
    },
    {
      userId: objectId('user3'),
      message: 'How can I adopt?',
      timestamp: new Date(),
    },
  ],
};

// Simulating multiple ongoing live streams
const liveStreams = [
  dummyStream,
  {
    ...dummyStream,
    _id: objectId('2'),
    title: 'Save Injured Kittens!',
    viewers: 189,
  },
  {
    ...dummyStream,
    _id: objectId('3'),
    title: 'Feeding Time at the Shelter',
    viewers: 92,
  },
];

const LiveStreamPage: React.FC = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [donations, setDonations] = useState(dummyStream.donations);
  const [chatMessages, setChatMessages] = useState(dummyStream.chatMessages);

  const handleDonate = () => {
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive donation amount.');
      return;
    }

    const newDonation = {
      donorId: objectId('userTemp'), // temporary dummy ID
      amount,
      message: donationMessage,
      timestamp: new Date(),
    };

    setDonations((prev) => [newDonation, ...prev]);
    setDonationAmount('');
    setDonationMessage('');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      userId: objectId('userTemp'), // temporary dummy ID
      message: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput('');
  };

  return (
    <div className="bg-[var(--color-light)] min-h-screen text-[var(--color-text)]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Stream */}
          <div className="flex-1">
            <div className="bg-black w-full aspect-video rounded-xl overflow-hidden relative shadow-lg">
              {dummyStream.isLive ? (
                <span className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs rounded-md shadow">
                  LIVE
                </span>
              ) : (
                <span className="absolute top-3 left-3 bg-gray-600 text-white px-3 py-1 text-xs rounded-md shadow">
                  OFFLINE
                </span>
              )}
              <span className="absolute top-3 right-3 bg-[var(--color-dark)] text-white px-3 py-1 text-xs rounded-md shadow">
                {dummyStream.viewers} watching
              </span>
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/mTCsxhH7yy4"
                title="Live Stream"
                allowFullScreen
              ></iframe>
            </div>

            <h1 className="text-3xl font-bold mt-6">{dummyStream.title}</h1>
            <p className="text-gray-700 mt-2 text-base">{dummyStream.description}</p>
          </div>

          {/* Right: Chat + Donations */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6">
            {/* Chat */}
            <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col h-[400px]">
              <h2 className="text-xl font-bold text-[var(--color-primary)] mb-3">Live Chat</h2>
              <div className="flex-1 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-2 bg-gray-50">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-semibold">{msg.userId.slice(-4)}:</span> {msg.message}
                    <span className="text-xs text-gray-500 ml-2">{formatTimestamp(msg.timestamp)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-[var(--color-secondary)]"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button
                  className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-light)] text-white px-4 py-2 rounded-md text-sm transition"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>

            {/* Donations */}
            <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col">
              <h2 className="text-xl font-bold text-[var(--color-primary)] mb-3">Make a Donation</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                <input
                  type="number"
                  min="1"
                  placeholder="Amount"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 w-25 text-sm focus:outline-none focus:ring focus:ring-[var(--color-secondary)]"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Message (Optional)"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 w-43 text-sm focus:outline-none focus:ring focus:ring-[var(--color-secondary)]"
                  value={donationMessage}
                  onChange={(e) => setDonationMessage(e.target.value)}
                />
                <button
                  className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-light)] text-white px-4 py-2 w-30 rounded-md text-sm transition"
                  onClick={handleDonate}
                >
                  Donate
                </button>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-sm text-gray-600 mb-2">Recent Donations</h3>
                <ul className="space-y-1 max-h-32 overflow-y-auto text-sm text-gray-700">
                  {donations.map((donation, idx) => (
                    <li key={idx}>
                      <span className="font-medium">${donation.amount}</span> — "{donation.message}"
                      <span className="text-xs text-gray-500 ml-2">{formatTimestamp(donation.timestamp)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Other Live Streams */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Ongoing Live Streams</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveStreams.map((stream) => (
              <div
                key={stream._id}
                className="bg-white bg-opacity-90 backdrop-blur rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-4"
              >
                <div className="relative h-48 overflow-hidden rounded-md mb-3 shadow-sm">
                  {stream.isLive && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      LIVE
                    </span>
                  )}
                  <iframe
                    className="w-full h-full object-cover rounded-md"
                    src="https://www.youtube.com/embed/mTCsxhH7yy4"
                    title={stream.title}
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className="text-lg font-semibold mb-1">{stream.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{stream.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-800">
                  <span>{stream.viewers} viewers</span>
                  <span className="text-[var(--color-accent)] font-semibold">Shelter #{stream.shelterId.slice(-4)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamPage;