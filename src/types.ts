
export type Industry = 
  | 'Technology' 
  | 'Healthcare' 
  | 'Finance' 
  | 'Manufacturing' 
  | 'Construction' 
  | 'Education' 
  | 'Hospitality' 
  | 'Creative & Media';

export type ListingType = 'Job' | 'Training' | 'Internship' | 'Both';

export interface Listing {
  id: string;
  companyName: string;
  title: string;
  industry: Industry;
  type: ListingType;
  skills: string[];
  description: string;
  companyDescription: string;
  benefits: string[];
  postedAt: string;
  applyUrl: string;
  applicationDeadline: string;
  priority?: number;
}

export const INDUSTRIES: Industry[] = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Construction',
  'Education',
  'Hospitality',
  'Creative & Media'
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'lc-1',
    companyName: 'Zoho Corporation',
    title: 'Software Developer (Zoho Schools)',
    industry: 'Technology',
    type: 'Training',
    skills: ['Logic', 'Problem Solving', 'Creativity'],
    description: 'An alternative to conventional college education. We hire based on potential, not degrees. Great for those seeking low-competition entry with high growth.',
    companyDescription: 'Global technology company that builds a wide range of business software.',
    benefits: ['No Degree Required', 'Immediate Hiring', 'Skill-based growth'],
    postedAt: '2024-05-06',
    applyUrl: 'https://www.zohoschools.com/',
    applicationDeadline: '2024-12-31',
    priority: 3
  },
  {
    id: 'lc-2',
    companyName: 'Ather Energy',
    title: 'Vehicle Engineering Intern',
    industry: 'Manufacturing',
    type: 'Internship',
    skills: ['Electric Vehicles', 'Mechanical Design', 'MATLAB'],
    description: 'Help build the future of electric mobility in India. Ather is a fast-paced environment looking for passionate engineers.',
    companyDescription: 'Indian electric vehicle company that manufactures electric scooters and charging infrastructure.',
    benefits: ['Cutting-edge Tech', 'High Impact', 'Startup Culture'],
    postedAt: '2024-05-05',
    applyUrl: 'https://www.atherenergy.com/careers',
    applicationDeadline: '2024-06-30',
    priority: 2
  },
  {
    id: 'lc-3',
    companyName: 'Razorpay',
    title: 'Associate Product Support',
    industry: 'Finance',
    type: 'Job',
    skills: ['SQL', 'Technical Support', 'Communication'],
    description: 'Join India\'s leading payments unicorn. This role is high growth and perfect for those looking to enter the Fintech space.',
    companyDescription: 'Full-stack financial services company that helps Indian businesses with payments and banking.',
    benefits: ['Esops', 'Work-life Balance', 'Learning Stipend'],
    postedAt: '2024-05-06',
    applyUrl: 'https://razorpay.com/jobs/',
    applicationDeadline: '2024-07-15',
    priority: 2
  },
  {
    id: 'lc-4',
    companyName: 'Dream11 (Sporta Tech)',
    title: 'Growth Marketing Associate',
    industry: 'Creative & Media',
    type: 'Job',
    skills: ['Analytics', 'Marketing Strategy', 'CRM'],
    description: 'Work at the intersection of Sports and Tech. Dream11 offers a unique culture and massive scale.',
    companyDescription: 'India\'s leading fantasy sports platform.',
    benefits: ['Sports Tickets', 'Gym Reimbursement', 'Flexible Hours'],
    postedAt: '2024-05-04',
    applyUrl: 'https://www.dream11.com/careers',
    applicationDeadline: '2024-06-25',
    priority: 1
  },
  {
    id: 'in-1',
    companyName: 'Google India',
    title: 'Software Engineering Intern',
    industry: 'Technology',
    type: 'Internship',
    skills: ['Data Structures', 'Algorithms', 'C++', 'Java'],
    description: 'Work on real-world projects and learn from the best engineers in the industry during this summer internship.',
    companyDescription: 'Leading global technology company focused on search, advertising, cloud, and hardware.',
    benefits: ['Competitive Stipend', 'Mentorship', 'Free Meals'],
    postedAt: '2024-05-04',
    applyUrl: 'https://careers.google.com/locations/india/',
    applicationDeadline: '2024-08-15'
  },
  {
    id: 'in-2',
    companyName: 'Flipkart',
    title: 'Product Management Intern',
    industry: 'Technology',
    type: 'Internship',
    skills: ['Product Strategy', 'Analytics', 'User Research'],
    description: 'Gain insight into the e-commerce world by working on high-impact product features for millions of users.',
    companyDescription: 'India\'s leading e-commerce marketplace offering millions of products across categories.',
    benefits: ['Industry Exposure', 'Cross-functional Collab', 'Stipend'],
    postedAt: '2024-05-05',
    applyUrl: 'https://www.flipkartcareers.com/',
    applicationDeadline: '2024-07-30'
  },
  {
    id: '1',
    companyName: 'TCS (Tata Consultancy Services)',
    title: 'Graduate Trainee Program',
    industry: 'Technology',
    type: 'Training',
    skills: ['Java', 'Python', 'Aptitude', 'Communication'],
    description: 'A structured entry-level program for engineering graduates to start their career in global IT services.',
    companyDescription: 'Global leader in IT services, consulting & business solutions with a large presence in India.',
    benefits: ['Training Certifications', 'Global Exposure', 'Health Insurance'],
    postedAt: '2024-05-01',
    applyUrl: 'https://www.tcs.com/careers/india/entry-level-hiring',
    applicationDeadline: '2024-06-30'
  },
  {
    id: '2',
    companyName: 'Reliance Industries',
    title: 'Operations Management Trainee',
    industry: 'Manufacturing',
    type: 'Both',
    skills: ['Operations', 'Supply Chain', 'Leadership'],
    description: 'Intensive on-field training for the next generation of Reliance manufacturing leaders.',
    companyDescription: 'India\'s largest private sector company with diverse businesses including energy and retail.',
    benefits: ['Travel Allowance', 'Performance Bonus', 'Relocation Support'],
    postedAt: '2024-04-28',
    applyUrl: 'https://www.ril.com/Careers/LearningDevelopment.aspx',
    applicationDeadline: '2024-06-15'
  },
  {
    id: '3',
    companyName: 'HDFC Bank',
    title: 'Relationship Manager',
    industry: 'Finance',
    type: 'Job',
    skills: ['Banking', 'Sales', 'Customer Relations'],
    description: 'Managing high-value client relationships across Indian retail banking sectors.',
    companyDescription: 'Leading private sector bank in India offering a wide range of financial services.',
    benefits: ['Competitive Pay', 'Banking Discounts', 'Career Growth'],
    postedAt: '2024-05-02',
    applyUrl: 'https://www.hdfcbank.com/personal/about-us/careers',
    applicationDeadline: '2024-07-01'
  },
  {
    id: '4',
    companyName: 'Infosys',
    title: 'Specialist Programmer',
    industry: 'Technology',
    type: 'Job',
    skills: ['Full Stack', 'Cloud', 'Problem Solving'],
    description: 'High-impact coding roles for elite developers at Infosys Bangalore and Hyderabad campuses.',
    companyDescription: 'Global leader in next-generation digital services and consulting.',
    benefits: ['Hybrid Work', 'Stock Options', 'Learning Allowance'],
    postedAt: '2024-05-01',
    applyUrl: 'https://www.infosys.com/careers/',
    applicationDeadline: '2024-06-20'
  },
  {
    id: '5',
    companyName: 'Apollo Hospitals',
    title: 'Medical Resident Internship',
    industry: 'Healthcare',
    type: 'Training',
    skills: ['Clinical Services', 'Patient Care', 'Diagnostics'],
    description: 'Hands-on training at India’s premier multi-specialty healthcare provider.',
    companyDescription: 'One of the largest integrated healthcare providers in Asia.',
    benefits: ['Medical Coverage', 'Training Workshop', 'Staff Meals'],
    postedAt: '2024-04-30',
    applyUrl: 'https://www.apollohospitals.com/careers',
    applicationDeadline: '2024-05-30'
  },
  {
    id: '6',
    companyName: 'L&T Construction',
    title: 'Graduate Engineer Trainee',
    industry: 'Construction',
    type: 'Training',
    skills: ['Civil Engineering', 'Project Management', 'Safety'],
    description: 'Build the nation with L&T. One of the most sought-after training programs for civil engineers.',
    companyDescription: 'Major technology, engineering, construction, manufacturing and financial services conglomerate.',
    benefits: ['Retirement Benefits', 'Project Bonus', 'Professional Membership'],
    postedAt: '2024-05-02',
    applyUrl: 'https://www.lntecc.com/careers/',
    applicationDeadline: '2024-06-10'
  },
  {
    id: '7',
    companyName: 'BYJU\'S',
    title: 'Academic Specialist',
    industry: 'Education',
    type: 'Job',
    skills: ['Teaching', 'Content Creation', 'Online Delivery'],
    description: 'Leading the EdTech revolution in India through engaging student interactions.',
    companyDescription: 'World\'s leading EdTech company and the creator of India\'s most loved school learning app.',
    benefits: ['Performance Incentives', 'Parental Leave', 'Employee Wellness'],
    postedAt: '2024-05-03',
    applyUrl: 'https://byjus.com/careers/',
    applicationDeadline: '2024-06-15'
  },
  {
    id: '8',
    companyName: 'Zomato',
    title: 'Brand Creative Lead',
    industry: 'Creative & Media',
    type: 'Job',
    skills: ['Copywriting', 'Design Strategy', 'Storytelling'],
    description: 'Craft the voice of one of India\'s most loved consumer brands.',
    companyDescription: 'Leading food discovery and delivery platform.',
    benefits: ['Food Vouchers', 'Gym Membership', 'Casual Dress Code'],
    postedAt: '2024-05-01',
    applyUrl: 'https://www.zomato.com/careers',
    applicationDeadline: '2024-06-25'
  },
  {
    id: '10',
    companyName: 'Wipro Limited',
    title: 'Project Engineer',
    industry: 'Technology',
    type: 'Job',
    skills: ['C++', 'Unix', 'Testing'],
    description: 'Work on cutting-edge software development projects for global clients.',
    companyDescription: 'Leading global information technology, consulting and business process services company.',
    benefits: ['Insurance', 'Vacation Time', 'Digital Upskilling'],
    postedAt: '2024-05-02',
    applyUrl: 'https://careers.wipro.com/global-india',
    applicationDeadline: '2024-07-15'
  },
  {
    id: '11',
    companyName: 'Cipla',
    title: 'Quality Control Associate',
    industry: 'Healthcare',
    type: 'Job',
    skills: ['Pharma', 'QC Testing', 'Compliance'],
    description: 'Ensuring the highest standards of medicine production in our Goa facility.',
    companyDescription: 'Global pharmaceutical company which uses cutting edge technology and innovation.',
    benefits: ['Pharma Discounts', 'Safety Equipment', 'Childcare'],
    postedAt: '2024-05-01',
    applyUrl: 'https://www.cipla.com/careers',
    applicationDeadline: '2024-06-20'
  },
  {
    id: '12',
    companyName: 'Adani Group',
    title: 'Management Trainee - Ports',
    industry: 'Manufacturing',
    type: 'Training',
    skills: ['Logistics', 'Operations', 'Leadership'],
    description: 'Learn port operations and logistics management at Mundra Port.',
    companyDescription: 'Indian multinational conglomerate, headquartered in Ahmedabad.',
    benefits: ['Housing', 'Competitive Salary', 'On-job Training'],
    postedAt: '2024-05-03',
    applyUrl: 'https://www.adani.com/careers',
    applicationDeadline: '2024-08-30'
  },
  {
    id: '13',
    companyName: 'Taj Hotels (IHCL)',
    title: 'Management Training Program',
    industry: 'Hospitality',
    type: 'Training',
    skills: ['Hospitality', 'Service Excellence', 'Management'],
    description: 'The standard of excellence in hospitality training in India.',
    companyDescription: 'Indian hospitality company that manages a portfolio of hotels, resorts, jungle safaris, palaces, spas and in-flight catering services.',
    benefits: ['Accommodation', 'Meals', 'Service Charge Share'],
    postedAt: '2024-05-02',
    applyUrl: 'https://www.ihcltata.com/careers/',
    applicationDeadline: '2024-12-31'
  },
  {
    id: '14',
    companyName: 'IndiGo Airlines',
    title: 'Cabin Crew Training',
    industry: 'Hospitality',
    type: 'Training',
    skills: ['Communication', 'Safety', 'Customer Care'],
    description: 'Join India’s leading airline and fly with pride.',
    companyDescription: 'Indian low-cost airline headquartered in Gurgaon, Haryana, India.',
    benefits: ['Staff Travel', 'Health Insurance', 'Retirement Savings'],
    postedAt: '2024-05-01',
    applyUrl: 'https://www.goindigo.in/careers.html',
    applicationDeadline: '2024-06-30'
  },
  {
    id: '15',
    companyName: 'Network18',
    title: 'Journalism Intern',
    industry: 'Creative & Media',
    type: 'Both',
    skills: ['Writing', 'Research', 'Digital Media'],
    description: 'Hands-on experience in one of India’s largest media conglomerates.',
    companyDescription: 'Indian media and entertainment group, owned by Reliance Industries.',
    benefits: ['Media Credentials', 'Networking', 'Stipend'],
    postedAt: '2024-05-03',
    applyUrl: 'https://www.network18online.com/careers',
    applicationDeadline: '2024-07-10'
  },
  {
    id: '16',
    companyName: 'State Bank of India',
    title: 'Probationary Officer',
    industry: 'Finance',
    type: 'Job',
    skills: ['Banking', 'Finance', 'General Awareness'],
    description: 'Start your career with India’s largest public sector bank.',
    companyDescription: 'Indian multinational public sector bank and financial services statutory body.',
    benefits: ['Pension Scheme', 'Housing Loans', 'Job Stability'],
    postedAt: '2024-05-01',
    applyUrl: 'https://sbi.co.in/web/careers',
    applicationDeadline: '2024-05-25'
  }
];
