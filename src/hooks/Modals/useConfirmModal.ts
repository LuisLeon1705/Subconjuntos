import { modals } from "@mantine/modals";

interface useConfirmModalProps {
  title: string;
  children: React.ReactNode;
  labels: { confirm: string; cancel: string };
  onConfirm: () => void;
  onCancel: () => void;
}

export const useConfirmModal = (props: useConfirmModalProps) => {
  const openModal = (onConfirm?: () => void) => {
    modals.openConfirmModal({
      ...props,
      onCancel: () => {
        props.onCancel();
        modals.closeAll();
      },
      onConfirm: () => {
        if (onConfirm) {
          onConfirm();
        } else {
          props.onConfirm();
        }
        modals.closeAll();
      },
    });
  };

  const closeModal = () => {
    modals.closeAll();
  };

  return {
    openModal,
    closeModal,
  };
};
