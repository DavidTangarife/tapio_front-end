export type OpportunityProps = {
  id: string;
  company: string;
  color: string;
  image: string;
};

export type BoardProps = {
  title: string;
  opportunities: OpportunityProps[];
};

export type EmailItemProps = {
  from: string;
  subject: string;
};
