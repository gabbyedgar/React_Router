// `Contact` type
export type Contact = {
  id?: string;
  first?: string;
  last?: string;
  createdAt?: number;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
};

export type Params = {
  contactId?: string;
};

export type Update = {
  [k: string]: FormDataEntryValue;
};
