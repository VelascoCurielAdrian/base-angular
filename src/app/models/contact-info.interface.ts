export interface ContactInfo {
  title: string;
  items: ContactItem[];
}

export interface ContactItem {
  label: string;
  value: string;
}
