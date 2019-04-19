# Sprint 4 - T23 - Byte Me

## Goal

### Worldwide!
### Sprint Leader: Kurt Wimer

## Definition of Done

* Version in pom.xml should be `<version>4.0.0</version>` for your final build for deployment.
* Increment release `v4.0` created on GitHub with appropriate version number and name.
* Increment `server-3.5.jar` deployed for testing and demonstration on CHECK4 assignment.
* Increment `server-4.0.jar` deployed for testing and demonstration on SPRINT4 assignment.
* Sprint Review, Restrospective, and Metrics completed (team/sprint4.md).


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


## Plan

This sprint will complete the following Epics.

* #39 Let me change my itinerary: allow user to add new locations
* #84 I Would like to highlight certain places on the map: add optional markers to the map with applicable data
* #51 Let me plan trips worldwide: allow better search filtering
* #58 I want to view my trip in other tools: allow trip to be exported to csv and svg or kml
* #56 Can trips be shorter: implement 2-opt optimization algorithm in the server

***(Include a discussion of you plan with key diagrams here and remove this!)***
![client](https://github.com/csucs314s19/t23/blob/master/sprints/sprint4_resources/clientDiagram.svg)
![server](https://github.com/csucs314s19/t23/blob/master/sprints/sprint4_resources/server.svg)
![itinerary](https://github.com/csucs314s19/t23/blob/master/sprints/sprint4_resources/itinerary.svg)

All other client scenes remain unchanged


## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | 5 | 3 |
| Tasks |  14   | 31 | 
| Story Points |  27  | 34 | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| 4/1 | | 240, 202, 247, 104 | |
| 4/3 | | 240, 202, 247, 104 | |
| 4/5 | | 247, 104, 202, 240| |
| 4/8 | 202, 240, 268, 270, 272, 275, 277,| 262, 250, 104, 247 | |
| 4/12 | 247, 291, 252, 254, 267, 276, 280, 282,  294, 262 | 249, 296, 251, 250 | |
| 4/15 | 249, 296,  | 251, 250, 253, 104| |
| 4/17 | 253, | 251, 250, 255, 104| |


## Review (focus on solution and technology)

In this sprint, we implemented filters for the tip find requests, created multiple file save formats, and caught up on tasks from sprint 3.
 

#### Completed epics in Sprint Backlog 

These Epics were completed.

* 242 I would like to highlight...:
* 241 I would like to plan trips worldwide: minimal task, only needed to switch database
* 246 I wan to view my trip in other tools: csv and sv implemented, kml was not

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.

* 99 I want to change my itinerary: adding locations from data-source has been left over from sprint three.
* 243 Can trips be shorter: 2-opt has not been implemented

#### What went well

Test coverage was very good this sprint.

#### Problems encountered and resolutions

No major techincal problems faced. We changed up wo was working on which parts which led to some issues with infamiliarity on parts of the codebase and technologies.
A couple rather hackey solutions are in the code which is not ideal.

## Retrospective (focus on people, process, tools)

Picking up tasks and not completing them/ switching tasks or taking multiple tasks messed up the task flow.


#### What we changed this sprint

More time was spent working as a group.

#### What we did well

We didn't break master. 

#### What we need to work on

We could improve improve efficiency and breaking tasks down into smaller increments.

#### What we will change next sprint 


