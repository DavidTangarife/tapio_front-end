export type Opportunity = {
  _id: string;
  title: string;
  company: {
    faviconUrl: string;
    name: string;
  };
  color: string;
  status_Id: string;
};

export type Board = {
  _id: string;
  title: string;
  opportunities: Opportunity[];
  project_Id: string;
};

// In case we are going to handle multiple Projects
export type Project = {
  _id: string;
  name: string;
  user_ID: string;
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
// POST /opportunities → Create new opportunity

// PATCH /opportunities/:id → Update opportunity (e.g., when moved to another board)

export interface AddToBoardModalProps {
  closeModal: () => void;
}

export interface Email {
  _id: string;
  from: string;
  subject: string;
  senderAddress: string;
  body: string;
  isRead: boolean;
  isTapped: boolean;
  date: Date;
}

export interface InboxProps {
  emails: Email[];
  onTapUpdate: (emailId: string, newTapped: boolean) => void;
}
