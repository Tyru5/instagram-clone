type HeaderActionsProps = {
  activeTab: 'stream' | 'photos';
  handleSetActiveTab: (tab: 'stream' | 'photos') => void;
};

export const HeaderActions = ({ activeTab, handleSetActiveTab }: HeaderActionsProps) => {
  return (
    <>
      <button
        onClick={() => handleSetActiveTab('stream')}
        className={`rounded-full px-6 py-2.5 font-medium transition-all ${
          activeTab === 'stream'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/20'
            : 'bg-background text-muted-foreground hover:bg-accent'
        }`}
      >
        Feed
      </button>
      <button
        onClick={() => handleSetActiveTab('photos')}
        className={`rounded-full px-6 py-2.5 font-medium transition-all ${
          activeTab === 'photos'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/20'
            : 'bg-background text-muted-foreground hover:bg-accent'
        }`}
      >
        My Photos
      </button>
    </>
  );
};
