import { Task, Goal, TaskBreakdownRequest, TaskCategory, TaskPriority } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

export async function generateTaskBreakdown(request: TaskBreakdownRequest): Promise<Goal> {
  const totalDays = request.totalDays || 14;
  const dueDate = request.dueDate ? new Date(request.dueDate) : undefined;

  if (OPENAI_API_KEY) {
    try {
      return await generateWithOpenAI(request.goal, totalDays, dueDate);
    } catch (error) {
      console.warn('OpenAI API failed, using fallback:', error);
    }
  }

  return generateIntelligentFallbackPlan(request.goal, totalDays, dueDate);
}

async function generateWithOpenAI(goal: string, totalDays: number, dueDate?: Date): Promise<Goal> {
  const prompt = `You are an expert project planning consultant. Break down the following goal into detailed, actionable tasks with specific daily activities.

Goal: "${goal}"
Time Constraint: ${totalDays} days
${dueDate ? `Due Date: ${dueDate.toISOString().split('T')[0]}` : ''}

Create a comprehensive project plan with tasks that are:
1. SPECIFIC to the goal topic (e.g., if it's about launching a product, include tasks like "Design product packaging", "Create marketing materials", "Set up e-commerce platform")
2. Highly detailed with clear descriptions of what needs to be done each day
3. Realistic in duration and sequencing
4. Properly categorized and prioritized

Provide a JSON response with this structure:
{
  "tasks": [
    {
      "title": "Specific task name relevant to the goal",
      "description": "Detailed description of daily activities and deliverables. Be specific about what needs to be accomplished.",
      "category": "Planning|Design|Development|Testing|Deployment",
      "priority": "High|Medium|Low",
      "estimatedDurationDays": 2.5,
      "dependsOn": [0, 1]
    }
  ]
}

IMPORTANT:
- Make tasks topic-specific and relevant to the actual goal
- Include 8-15 comprehensive tasks
- Add detailed descriptions that explain daily activities
- Set realistic priorities based on dependencies
- Ensure tasks fit within ${totalDays} days accounting for dependencies
- High priority = critical path items
- Medium priority = important but not blocking
- Low priority = nice-to-have or final polish

Return ONLY valid JSON.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert project planner. Create detailed, topic-specific project plans with comprehensive task breakdowns. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 3000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0] : content;
  const parsed = JSON.parse(jsonStr);

  return buildGoalFromParsedData(goal, parsed.tasks, totalDays, dueDate);
}

function generateIntelligentFallbackPlan(goal: string, totalDays: number, dueDate?: Date): Promise<Goal> {
  const goalLower = goal.toLowerCase();

  let tasks: any[] = [];

  if (goalLower.includes('product') || goalLower.includes('launch') || goalLower.includes('app') || goalLower.includes('website')) {
    tasks = [
      {
        title: 'Market research and competitive analysis',
        description: 'Day 1: Identify target audience demographics and psychographics. Day 2: Analyze top 5-10 competitors, their strengths and weaknesses. Day 3: Create detailed user personas with goals, pain points, and behaviors. Day 4: Document market gaps and opportunities. Define unique value proposition and competitive positioning strategy.',
        category: 'Planning',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.12,
        dependsOn: [],
      },
      {
        title: 'Product requirements and feature specification',
        description: 'Document all core and nice-to-have features with user stories. Create acceptance criteria for each feature. Define technical requirements, performance benchmarks, and scalability needs. Prioritize features using MoSCoW method. Create product roadmap and sprint planning.',
        category: 'Planning',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.1,
        dependsOn: [0],
      },
      {
        title: 'Design system and UI/UX mockups',
        description: 'Day 1-2: Create comprehensive design system including color palette, typography scale, spacing system, and component library. Day 3-4: Design high-fidelity mockups for all screens and user flows. Day 5: Create interactive prototypes using Figma or Adobe XD. Day 6: Conduct internal design reviews and iterations.',
        category: 'Design',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.15,
        dependsOn: [1],
      },
      {
        title: 'Development environment setup',
        description: 'Set up Git repository with branching strategy. Configure CI/CD pipelines using GitHub Actions or Jenkins. Set up development, staging, and production environments. Configure databases (PostgreSQL/MongoDB), caching (Redis), and message queues. Establish coding standards, linting rules, and documentation practices.',
        category: 'Development',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.08,
        dependsOn: [2],
      },
      {
        title: 'Core functionality development',
        description: 'Implement main business logic and domain models. Build database schemas with proper indexing and relationships. Create RESTful or GraphQL API endpoints. Develop authentication system with JWT or OAuth. Implement authorization and role-based access control. Add input validation and error handling.',
        category: 'Development',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.25,
        dependsOn: [3],
      },
      {
        title: 'Frontend implementation',
        description: 'Build responsive UI components using React/Vue/Angular. Implement state management with Redux/Vuex/Context API. Create reusable component library. Add form validation with real-time feedback. Implement data fetching and caching strategies. Optimize bundle size and code splitting. Ensure WCAG accessibility compliance.',
        category: 'Development',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.18,
        dependsOn: [3],
      },
      {
        title: 'Integration and API connections',
        description: 'Connect frontend to backend APIs with error handling. Integrate payment processing (Stripe/PayPal). Add analytics tracking (Google Analytics, Mixpanel). Implement email service (SendGrid/Mailgun). Add push notifications if needed. Integrate third-party services and webhooks. Test all data flows end-to-end.',
        category: 'Development',
        priority: 'Medium',
        estimatedDurationDays: totalDays * 0.1,
        dependsOn: [4, 5],
      },
      {
        title: 'Comprehensive testing and QA',
        description: 'Write and run unit tests for all components. Perform integration testing of API endpoints. Conduct end-to-end testing with Cypress/Selenium. Test across Chrome, Firefox, Safari, and Edge. Test on mobile devices (iOS and Android). Load testing and performance optimization. Security audit and penetration testing. Fix all critical and high-priority bugs.',
        category: 'Testing',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.12,
        dependsOn: [6],
      },
      {
        title: 'User acceptance testing and feedback',
        description: 'Recruit beta testers from target audience. Create testing scenarios and feedback forms. Conduct moderated usability testing sessions. Gather quantitative and qualitative feedback. Analyze feedback and prioritize improvements. Implement critical changes and bug fixes. Validate that all acceptance criteria are met.',
        category: 'Testing',
        priority: 'Medium',
        estimatedDurationDays: totalDays * 0.08,
        dependsOn: [7],
      },
      {
        title: 'Marketing materials and content creation',
        description: 'Write compelling landing page copy with clear CTAs. Create product screenshots and demo videos. Design email templates for onboarding sequence. Write blog posts announcing the launch. Create social media content calendar. Design promotional graphics and banners. Prepare press kit with logo, screenshots, and company info.',
        category: 'Design',
        priority: 'Medium',
        estimatedDurationDays: totalDays * 0.1,
        dependsOn: [2],
      },
      {
        title: 'Documentation and help resources',
        description: 'Write comprehensive user guide and getting started documentation. Create video tutorials for key features. Document API specifications with examples. Prepare FAQs based on common questions. Set up knowledge base or help center. Create troubleshooting guides. Document code for future developers.',
        category: 'Deployment',
        priority: 'Low',
        estimatedDurationDays: totalDays * 0.07,
        dependsOn: [8],
      },
      {
        title: 'Production deployment and launch',
        description: 'Configure production servers with auto-scaling. Set up CDN for static assets. Configure SSL certificates and domain. Set up monitoring with Datadog/New Relic. Implement logging aggregation. Create database backups and disaster recovery plan. Perform final security scan. Execute launch checklist. Monitor system health and user behavior closely.',
        category: 'Deployment',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.05,
        dependsOn: [8, 9],
      },
    ];
  } else if (goalLower.includes('marketing') || goalLower.includes('campaign') || goalLower.includes('promotion')) {
    tasks = [
      {
        title: 'Campaign strategy and objectives',
        description: 'Define SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound). Identify primary and secondary KPIs (CTR, conversion rate, ROI, etc.). Set budget allocation across channels (30% social, 25% email, 20% paid ads, 25% content). Create campaign brief with messaging pillars and brand guidelines. Define success metrics and reporting cadence.',
        category: 'Planning',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.12,
        dependsOn: [],
      },
      {
        title: 'Market research and audience analysis',
        description: 'Conduct customer surveys (minimum 100 responses) and 10-15 in-depth interviews. Analyze competitor campaigns and their engagement rates. Research audience preferences through social listening tools. Create 3-5 detailed buyer personas with demographics, psychographics, pain points, and media consumption habits. Map customer journey from awareness to conversion.',
        category: 'Planning',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.15,
        dependsOn: [0],
      },
      {
        title: 'Content strategy and editorial calendar',
        description: 'Plan content themes aligned with campaign goals. Create 30-day editorial calendar with specific topics, formats, and platforms. Define content mix: 40% educational, 30% promotional, 20% entertaining, 10% user-generated. Assign content creation responsibilities to team members. Plan content repurposing strategy across channels.',
        category: 'Planning',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.1,
        dependsOn: [1],
      },
      {
        title: 'Creative assets and design',
        description: 'Design 20+ social media graphics in multiple sizes (1080x1080, 1200x628, 1080x1920). Create 5 variations of ad creatives for A/B testing. Design responsive email templates with mobile optimization. Develop landing page mockups with clear conversion funnels. Create banner ads in standard IAB sizes. Design infographics and downloadable resources.',
        category: 'Design',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.18,
        dependsOn: [2],
      },
      {
        title: 'Content creation and copywriting',
        description: 'Write 10-15 blog posts (1000-1500 words each) optimized for SEO. Create social media copy for 60+ posts with platform-specific best practices. Write email sequences: 1 announcement, 3 nurture, 2 promotional emails. Script and shoot 3-5 video tutorials or promotional videos. Develop 5-10 case studies showcasing results. Optimize all content for target keywords and conversion.',
        category: 'Development',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.2,
        dependsOn: [3],
      },
      {
        title: 'Campaign platform setup and integration',
        description: 'Set up Google Ads, Facebook Ads Manager, and LinkedIn Campaign Manager accounts. Configure pixel tracking on website for retargeting. Set up email marketing platform (Mailchimp/HubSpot) with audience segmentation. Create UTM parameters for tracking. Set up Google Analytics goals and conversion funnels. Configure marketing automation workflows.',
        category: 'Development',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.1,
        dependsOn: [3],
      },
      {
        title: 'Campaign launch and activation',
        description: 'Schedule all social media posts using Hootsuite/Buffer. Launch paid advertising campaigns with proper targeting and bid strategies. Send launch announcement email to entire list. Activate retargeting campaigns. Publish blog posts and press releases. Reach out to influencers and media contacts. Monitor initial performance and engagement in real-time.',
        category: 'Deployment',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.08,
        dependsOn: [4, 5],
      },
      {
        title: 'Performance monitoring and optimization',
        description: 'Track KPIs daily using analytics dashboard. A/B test ad creatives, headlines, and CTAs. Optimize bid strategies and adjust budgets based on performance. Adjust targeting parameters to improve ROI. Respond to comments and engage with audience. Analyze which content performs best and create more. Generate and review weekly performance reports. Reallocate budget to highest-performing channels.',
        category: 'Testing',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.15,
        dependsOn: [6],
      },
      {
        title: 'Campaign analysis and reporting',
        description: 'Compile comprehensive results: impressions, clicks, conversions, cost per acquisition, ROI. Analyze which channels, content types, and messaging performed best. Create executive presentation with key insights and recommendations. Calculate overall campaign ROI and compare to initial goals. Document lessons learned and best practices. Create recommendations for future campaigns based on data.',
        category: 'Testing',
        priority: 'Medium',
        estimatedDurationDays: totalDays * 0.07,
        dependsOn: [7],
      },
    ];
  } else if (goalLower.includes('event') || goalLower.includes('conference') || goalLower.includes('workshop')) {
    tasks = [
      {
        title: 'Event concept and strategic planning',
        description: 'Define event purpose: education, networking, product launch, or brand awareness. Set attendance goals (target: 100-500 attendees) and success metrics. Create event theme, name, and tagline. Establish detailed budget breakdown: venue 30%, catering 20%, marketing 15%, AV 10%, speakers 10%, contingency 15%. Define target audience personas and value proposition.',
        category: 'Planning',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.1,
        dependsOn: [],
      },
      {
        title: 'Venue selection and contract negotiation',
        description: 'Create venue requirements checklist: capacity, location, parking, AV capabilities, catering options, accessibility. Research and visit 5-8 potential venues. Compare pricing, availability, and amenities. Negotiate contracts including cancellation terms and payment schedule. Conduct site visit and create detailed floor plan. Coordinate with venue on setup and breakdown schedule.',
        category: 'Planning',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.12,
        dependsOn: [0],
      },
      {
        title: 'Speaker recruitment and content planning',
        description: 'Identify and invite 8-12 speakers relevant to event theme. Send speaker invitations with event details and expectations. Develop event agenda with keynotes, panels, workshops, and networking breaks. Coordinate speaker requirements: AV needs, travel, accommodations. Collect speaker bios, photos, and presentation topics. Plan 2-3 networking activities and interactive sessions. Create backup plans for speaker cancellations.',
        category: 'Planning',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.15,
        dependsOn: [1],
      },
      {
        title: 'Event branding and website development',
        description: 'Design event logo, color scheme, and visual identity system. Create event website with sections: agenda, speakers, venue, registration, sponsors, FAQs. Implement responsive design and mobile optimization. Design promotional materials: posters, flyers, email headers, social media graphics. Create speaker presentation templates with consistent branding. Design printed materials: badges, signage, programs, banners.',
        category: 'Design',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.12,
        dependsOn: [2],
      },
      {
        title: 'Marketing and promotional campaign',
        description: 'Launch multi-channel marketing campaign: email (6 campaigns), social media (daily posts for 8 weeks), paid ads ($2000-5000 budget). Create early bird pricing (25% discount for first 30 days). Reach out to 20+ industry influencers for promotion. Send press releases to 50+ relevant media outlets. Create promotional video and teasers. Partner with associations for cross-promotion. Activate affiliate marketing program offering 10% commission.',
        category: 'Development',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.18,
        dependsOn: [3],
      },
      {
        title: 'Registration and ticketing infrastructure',
        description: 'Set up Eventbrite or custom ticketing platform with Stripe integration. Create ticket tiers: Early Bird ($199), Regular ($299), VIP ($499), Group discounts (5+ tickets). Configure automated email confirmations and reminders (T-30 days, T-7 days, T-1 day). Set up attendee management system with check-in QR codes. Create discount codes for partners and sponsors. Implement waitlist functionality.',
        category: 'Development',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.08,
        dependsOn: [3],
      },
      {
        title: 'Logistics coordination and vendor management',
        description: 'Arrange catering: breakfast, lunch, snacks, and coffee service for all days. Book AV equipment: microphones, projectors, screens, recording equipment. Coordinate transportation: shuttle service from hotels, parking validation. Book speaker accommodations at partner hotels with negotiated rates. Order event swag: branded notebooks, pens, tote bags, lanyards. Hire and brief 15-20 event staff and volunteers. Create detailed run-of-show document.',
        category: 'Development',
        priority: 'Medium',
        estimatedDurationDays: totalDays * 0.12,
        dependsOn: [1, 5],
      },
      {
        title: 'Event execution and on-site management',
        description: 'Day before: Set up registration desk, signage, AV equipment, sponsor booths. Morning of: Arrive 3 hours early, conduct final walkthroughs, brief all staff. During event: Manage registration check-in, coordinate speaker transitions, handle AV support, address attendee questions, ensure catering is on schedule. Document event: professional photography and videography. Real-time social media coverage. Handle any emergencies or issues immediately.',
        category: 'Deployment',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.08,
        dependsOn: [6],
      },
      {
        title: 'Post-event follow-up and impact analysis',
        description: 'Send thank you emails to all attendees within 24 hours. Survey attendees (target 40%+ response rate) about satisfaction and areas for improvement. Send speaker thank you notes and certificates. Share event recordings, slide decks, and photos on website. Compile and analyze metrics: attendance rate, no-show rate, session popularity, attendee satisfaction (4.5+ stars goal). Calculate event ROI. Create comprehensive post-event report with recommendations.',
        category: 'Testing',
        priority: 'Medium',
        estimatedDurationDays: totalDays * 0.05,
        dependsOn: [7],
      },
    ];
  } else {
    tasks = [
      {
        title: 'Project scope and requirements gathering',
        description: 'Day 1: Conduct stakeholder interviews with all key decision-makers to understand needs, expectations, and constraints. Day 2: Document functional and non-functional requirements in detail. Day 3: Define project scope, deliverables, milestones, and success criteria. Day 4: Create project charter and get stakeholder sign-off. Identify risks and mitigation strategies.',
        category: 'Planning',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.15,
        dependsOn: [],
      },
      {
        title: 'Research and feasibility analysis',
        description: 'Research industry best practices and case studies. Analyze technical feasibility including required technologies, skills, and infrastructure. Evaluate available tools, frameworks, and third-party services. Assess resource availability and skill gaps. Create proof of concept for high-risk technical components. Conduct cost-benefit analysis and prepare recommendations.',
        category: 'Planning',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.12,
        dependsOn: [0],
      },
      {
        title: 'Detailed planning and system design',
        description: 'Create detailed project plan with work breakdown structure (WBS). Define all milestones and key deliverables with dates. Design system architecture, data models, and workflows. Create technical specifications and design documents. Allocate resources and assign clear responsibilities. Set up project management tools and communication channels. Establish quality assurance processes.',
        category: 'Design',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.15,
        dependsOn: [1],
      },
      {
        title: 'Environment setup and tool configuration',
        description: 'Set up development environment with all necessary tools and dependencies. Configure version control system with branching strategy. Set up project management and collaboration tools (Jira, Slack, etc.). Configure continuous integration and deployment pipelines. Establish code review processes and quality gates. Create documentation structure and templates. Set up testing frameworks.',
        category: 'Development',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.08,
        dependsOn: [2],
      },
      {
        title: 'Core implementation phase 1',
        description: 'Build foundational components and infrastructure layer. Implement critical features following agile methodology with 2-week sprints. Conduct daily standup meetings to track progress. Perform code reviews for all commits. Write unit tests achieving 80%+ code coverage. Address technical debt regularly. Document all major decisions and implementations.',
        category: 'Development',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.18,
        dependsOn: [3],
      },
      {
        title: 'Core implementation phase 2',
        description: 'Complete remaining features and integrations with external systems. Refactor code for maintainability, readability, and performance. Optimize database queries and implement caching strategies. Address all technical debt accumulated during phase 1. Improve error handling and logging throughout the system. Update documentation to reflect all changes.',
        category: 'Development',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.15,
        dependsOn: [4],
      },
      {
        title: 'Comprehensive testing and quality assurance',
        description: 'Perform thorough unit testing of all components and modules. Conduct integration testing of all system interfaces. Run end-to-end testing of complete user workflows. Perform load testing and stress testing to validate performance. Conduct security testing and vulnerability scanning. Test accessibility compliance (WCAG 2.1 standards). Fix all critical and high-priority bugs. Validate against requirements checklist.',
        category: 'Testing',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.12,
        dependsOn: [5],
      },
      {
        title: 'User acceptance testing and feedback',
        description: 'Recruit representative users from target audience for UAT. Create detailed test scenarios covering all major workflows. Conduct moderated testing sessions with 10-15 users. Gather both quantitative metrics and qualitative feedback. Analyze feedback and prioritize issues by severity and impact. Implement critical changes and enhancements. Conduct follow-up testing to validate fixes.',
        category: 'Testing',
        priority: 'Medium',
        estimatedDurationDays: totalDays * 0.08,
        dependsOn: [6],
      },
      {
        title: 'Documentation and knowledge transfer',
        description: 'Create comprehensive user documentation covering all features and workflows. Develop training materials: video tutorials, quick start guides, FAQs. Prepare detailed technical documentation for future maintenance and enhancements. Document system architecture, APIs, and integration points. Create runbooks for operations team. Conduct knowledge transfer sessions with stakeholders. Set up support infrastructure.',
        category: 'Deployment',
        priority: 'Medium',
        estimatedDurationDays: totalDays * 0.07,
        dependsOn: [7],
      },
      {
        title: 'Production deployment and launch',
        description: 'Prepare production environment with proper security configurations. Conduct final security audit and penetration testing. Create rollback plan and disaster recovery procedures. Deploy to production following deployment checklist. Perform smoke testing on production environment. Monitor system health, performance, and error rates closely. Provide immediate support for any issues. Conduct post-launch retrospective meeting.',
        category: 'Deployment',
        priority: 'High',
        estimatedDurationDays: totalDays * 0.05,
        dependsOn: [8],
      },
    ];
  }

  return Promise.resolve(buildGoalFromParsedData(goal, tasks, totalDays, dueDate));
}

function buildGoalFromParsedData(
  goalTitle: string,
  parsedTasks: any[],
  totalDays: number,
  dueDate?: Date
): Goal {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const tasks: Task[] = parsedTasks.map((task, index) => ({
    id: crypto.randomUUID(),
    title: task.title,
    description: task.description,
    category: task.category as TaskCategory,
    priority: task.priority as TaskPriority,
    estimatedDurationDays: task.estimatedDurationDays,
    startDay: 0,
    endDay: 0,
    startDate: new Date(startDate),
    endDate: new Date(startDate),
    status: 'pending' as const,
    dependencies: [],
    orderIndex: index,
  }));

  parsedTasks.forEach((task, index) => {
    if (task.dependsOn && Array.isArray(task.dependsOn)) {
      tasks[index].dependencies = task.dependsOn
        .filter((depIndex: number) => depIndex >= 0 && depIndex < tasks.length)
        .map((depIndex: number) => tasks[depIndex].id);
    }
  });

  calculateTaskTimelines(tasks, startDate, totalDays);

  return {
    id: crypto.randomUUID(),
    title: goalTitle,
    totalDays,
    dueDate,
    status: 'pending',
    tasks,
    createdAt: new Date(),
  };
}

function calculateTaskTimelines(tasks: Task[], startDate: Date, totalDays: number): void {
  const taskMap = new Map<string, Task>();
  tasks.forEach(task => taskMap.set(task.id, task));

  function getTaskEndDay(task: Task): number {
    if (task.endDay > 0) return task.endDay;

    let maxDependencyEnd = 0;
    for (const depId of task.dependencies) {
      const depTask = taskMap.get(depId);
      if (depTask) {
        maxDependencyEnd = Math.max(maxDependencyEnd, getTaskEndDay(depTask));
      }
    }

    task.startDay = maxDependencyEnd;
    task.endDay = task.startDay + task.estimatedDurationDays;
    return task.endDay;
  }

  tasks.forEach(task => getTaskEndDay(task));

  const maxEndDay = Math.max(...tasks.map(t => t.endDay));
  const scaleFactor = maxEndDay > totalDays ? totalDays / maxEndDay : 1;

  tasks.forEach(task => {
    task.startDay = task.startDay * scaleFactor;
    task.endDay = task.endDay * scaleFactor;
    task.estimatedDurationDays = task.endDay - task.startDay;

    task.startDate = new Date(startDate);
    task.startDate.setDate(task.startDate.getDate() + Math.floor(task.startDay));

    task.endDate = new Date(startDate);
    task.endDate.setDate(task.endDate.getDate() + Math.ceil(task.endDay));
  });
}
