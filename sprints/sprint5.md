# Sprint 5 - *23* - *Byte Me*

## Goal

### A Beautiful User Experience!
### Sprint Leader: *Joshua Burris*

## Definition of Done

* Version in pom.xml should be `<version>5.0.0</version>` for your final build for deployment.
* Increment release `v5.0` created on GitHub with appropriate version number and name.
* Increment `server-5.0.jar` deployed for testing and demonstration on SPRINT5 assignment.
* Sprint Review, Restrospective, and Metrics completed (team/sprint5.md).


## Policies

#### Mobile First Design!
* Design for mobile, tablet, laptop, desktop (in that order).
* Use ReactStrap for a consistent interface (no HTML, CSS, style, etc.).
* Must adhere to the TripCo Interchange Protocol (TIP) for interoperability and testing.
#### Clean Code
* Code Climate maintainability of A or B.
* Code adheres to Google style guides for Java and JavaScript.
#### Test Driven Development
* Write method headers, unit tests, and code in that order.
* Unit tests are fully automated.
* Code Coverage above 50%
#### Configuration Management
* Always check for new changes in master to resolve merge conflicts locally before committing them.
* All changes are built and tested before they are committed.
* All commits include a task/issue number.
* All commits include tests for the added or modified code.
* All tests pass.
#### Continuous Integration / Delivery 
* Master is never broken.  If broken, it is fixed immediately.
* Continuous integration successfully builds and tests all pull requests for master branch.
* All Java dependencies in pom.xml.  Do not load external libraries in your repo. 
* Each team member must complete Interop with another team and file an issue in the **class** repo with the results.
  * title is your team number and your name, 
  * labels should include Interop and the Team that you tested with, 
  * description should include a list of tests performed, noting any failures that occurred.


## Plan

This sprint will complete the following Epics.

* *#331 Make the application easier to use:*
  * Get feedback from other teams and people outside the class on your user experience.
  * Make improvements in your user experience so someone not familiar with it can use it with no help from team members.
* *#332 Reduce technical debt*
* *#340 Fix bugs*

![client](https://github.com/csucs314s19/t23/blob/master/sprints/sprint4_resources/clientDiagram.svg)
![server](https://github.com/csucs314s19/t23/blob/master/sprints/sprint4_resources/server.svg)
![itinerary](https://github.com/csucs314s19/t23/blob/master/sprints/sprint4_resources/itinerary.svg)


## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | *3* | *2* |
| Tasks |  *19*   | *18* | 
| Story Points |  *30*  | *28* | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *4/22/2019* | *none* | *#104, #339, #345, #346* | *none* |
| *4/24/2019* | *#250, #269, #345* | *#104, #330, #346* | *none* |
| *4/26/2019* | *#236, #334, #339, #356* | *#315, #333, #342, #353* | *none* |
| *4/29/2019* | *#333* | *#315, #330, #342, #353* | *none* |
| *5/1/2019* | *none* | *#315, #330, #342, #353* | *none* |
| *5/3/2019* | *#104, #266, #315, #317, #330, #335, #342, #346, #353, #364, #368* | *#271, #338, #344, #347* | *none* |
| *5/6/2019* | *none* | *#271, #338, #344, #347* | *none* |
| *5/8/2019* | *#359, #388, #343, #362, #310, #313, #312, #271, #347, #344,#338* | *#341* | *none* |



## Review (focus on solution and technology)

In this sprint we improved user experience and made the back-end more efficient.

#### Completed epics in Sprint Backlog 

These Epics were completed.

* *#331 Make the application easier to use: We've improved user experience and tried to put things in one place so they're easier to find.*
* *#340 Fix bugs: We also created a lot more tests that catch bugs before they happen.*

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.

* *#332 Reduce technical debt: We weren't able to remove all of the duplicate code, but we did remove warnings and created some files for specific objects.*

#### What went well

We worked a lot faster and more eficiently this sprint. We also finished all of the tasks we weren't able to finish in other sprints.


#### Problems encountered and resolutions

User experience is really hard to get right. You basically just have to try different things and see if they look good, and it's really easy to get tunnel visioned on what you think looks good.


## Retrospective (focus on people, process, tools)

In this sprint we worked better as a team and asking each other for help. The process went by way quicker when we work together more.

#### What we changed this sprint

Our changes for this sprint included focusing more on API fixes because we haven't done well on that in the past so we really tried to improve that.

#### What we did well

Our UI looks better, but it could always be improved. Our program runs more efficiently and our tests make sure everything works as we make changes, not after.

#### What we need to work on

We could always add more tests and improve UI, but I really think we could work more on API and why it was failing for so long.

#### What we will change next sprint 

Improve UI and add more tests and features.
