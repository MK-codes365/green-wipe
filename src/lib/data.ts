export interface Drive {
  id: string;
  name: string;
  model: string;
  size: string;
  type: 'SSD' | 'HDD' | 'NVMe';
  isBoot?: boolean;
}

export const drives: Drive[] = [
  {
    id: 'sda',
    name: 'Kingston A400',
    model: 'SA400S37/240G',
    size: '240 GB',
    type: 'SSD',
    isBoot: true,
  },
  {
    id: 'sdb',
    name: 'Seagate Barracuda',
    model: 'ST2000DM008',
    size: '2 TB',
    type: 'HDD',
  },
  {
    id: 'sdc',
    name: 'Samsung 970 EVO Plus',
    model: 'MZ-V7S500BW',
    size: '500 GB',
    type: 'NVMe',
  },
  {
    id: 'sdd',
    name: 'WD Blue',
    model: 'WD10EZEX',
    size: '1 TB',
    type: 'HDD',
  },
];
