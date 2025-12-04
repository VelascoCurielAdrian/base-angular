export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  route?: string;
  action?: () => void;
}
