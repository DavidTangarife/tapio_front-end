export type Opportunity_type = {
  oppor_id: string;
  company: string;
  color: string;
  image: string;
  board: string;
};

export type Board_Type = {
  board_id: string;
  title: string;
  opportunities: Opportunity_type[];
};

export type EmailItemProps = {
  from: string;
  subject: string;
};

export interface ViewEmailActionButtonProps {
  icon: React.ElementType;
  text: string;
  value: string;
  onClick?: () => void;
  iconSx?: object;
}

export interface AddToBoardModalProps {
  closeModal: () => void;
}