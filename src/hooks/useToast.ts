import { useToastContext } from '@/context/ToastContext';

export { useToastContext };

export const useToast = () => {
  return useToastContext();
};

export default useToast;
