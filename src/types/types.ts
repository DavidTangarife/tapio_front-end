import { UniqueIdentifier } from "@dnd-kit/core";

export type Opportunity = {
  _id: string;
  title: string;
  company: {
    name: string;
    logoUrl: string;
    brandColor: string;
  };
  description: {
    location: string;
    type: string;
    salary: string;
    posted: string;
    success?: boolean;
  };
  snippets: Record<string, string>[];
  statusId: string;
  index: number;
  position: number;
  boardIndex: number;
  opportunityGroup: UniqueIdentifier
};

export type Board = {
  _id: string;
  title: string;
  opportunities: Opportunity[];
  project_Id: string;
  order: number;
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
  updateButtonTitle: () => void;
}
export interface linkToOppModalProps {
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

export type paginatedEmails ={
  emails: Email[];
  total: number;
  page: number;
  pages: number;
}
export interface InboxProps {
  unreadPage: number;
  readPage: number;
  tappedPage: number;
  unreadEmails: paginatedEmails | null;
  readEmails: paginatedEmails | null;
  tappedEmails: Email[];
  onTapUpdate: (emailId: string, newTapped: boolean) => void;
  onRefreshInbox: () => void;
  refreshMessage: string | null;
  setUnreadPage: (page: number) => void;
  setReadPage: (page: number) => void;
  setTappedPage: (page: number) => void;
  refreshLoadingIcon: boolean;
}

export type SenderData = {
  _id: string;
  from: string;
  date: Date;
  subject: string;
  isApproved?: boolean;
  isProcessed?: boolean;
}

export interface EmailPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}
