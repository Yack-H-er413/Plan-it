# Plan-it

## Inspiration
As first-year students, it has been very tumultuous to navigate our course roadmaps. As a way to combat the myriad graduation problems that stem from misunderstandings about requirements and prerequisites, we wanted to create a website that gives students options and alternatives for their schedules. 

## What it does
Course planning can feel overwhelming - especially for first-generation and transfer students who may not have the same institutional guidance or familiarity with university or high school systems. Prerequisite chains are difficult to navigate, where one missed class can delay progress by an entire semester or more. And for students with learning disabilities, especially, requirement groups are hard to track in static documents, making it unclear which courses actually count toward degree requirements. Without clear, visual guidance, students are often left unsure whether they are truly staying on track for graduation when planning future semesters.

## How we built it
* **Framework/UI:** Next.js (App Router) + React
* **Language:** TypeScript
* **Styling:** Tailwind CSS (via PostCSS + Autoprefixer)
* **Auth:** Auth.js / NextAuth v5 (Google OAuth)
* **Data persistence:** Browser `localStorage` (no backend DB)
* **UI utilities:** Motion (animations), Lucide React (icons), `clsx` + `tailwind-merge` (class handling)
* **Tooling:** ESLint for linting

## Challenges we ran into
We had a hard time trying to implement Google Authenticator for our login. My team had also found it challenging to get accustomed to using the terminal as well as the many commands that come with GitHub repositories. 

## Accomplishments that we're proud of
We made a timely solution to a long-standing issue that is not only easy to use and understand, but also detailed. 

## What we learned
We learned that communication is key within teamwork, distributing tasks regarding one's strengths so we can make the best version of our website in the limited time that we have, asking for help, and to keep things light-hearted and not stressful. 

## What's next for Plan-it
In the future, we plan to expand the course map with more templates and an option for verified university advisor accounts. Verified advisors would be able to create and maintain templates for new courses and their prerequisites. They would provide school-specific course recommendations and allow the platform to sync with a university’s administration and surface the same official guidance to students attending that school. We could also incorporate AI to prefill information from the course catalog and student transcript. For now, we are proud to present Plan-It, a visual course mapping tool that helps students better understand their academic paths. Plan smarter. Graduate faster. Mapping your degree, one class at a time.
