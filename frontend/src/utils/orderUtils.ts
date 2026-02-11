export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-500';
    case 'processing':
      return 'bg-blue-500';
    case 'shipped':
      return 'bg-purple-500';
    case 'delivered':
      return 'bg-green-500';
    case 'completed':
      return 'bg-green-600';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const getStatusSteps = (currentStatus: string): { label: string; active: boolean; completed: boolean }[] => {
  const statuses = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statuses.indexOf(currentStatus.toLowerCase());
  
  return statuses.map((status, index) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    active: index === currentIndex,
    completed: index < currentIndex,
  }));
};

export const pluralize = (count: number, singular: string, plural?: string): string => {
  return count === 1 ? singular : (plural || `${singular}s`);
};
