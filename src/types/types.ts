export type Opportunity = {
  _id: string;
  title: string;
  company: {
    name: string;
    logoUrl: string;
    brandColor: string;
  };
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
  isProcessed: boolean;
  isApproved: boolean;
  date: Date;
}

export interface InboxProps {
  emails: Email[];
  onTapUpdate: (emailId: string, newTapped: boolean) => void;
  onRefreshInbox: () => void;
}

export type SenderData = {
  _id: string;
  from: string;
  date: Date;
  subject: string;
  isApproved?: boolean;
  isProcessed?: boolean;
}