# Sprint 3 - t23 - Byte Me

## Goal

### Shorter trips to more places!
### Sprint Leader: Timothy Rooney

## Definition of Done

* Version in pom.xml should be `<version>3.0.0</version>` for your final build for deployment.
* Increment release `v3.0` created on GitHub with appropriate version number and name.
* Increment `server-3.0.jar` deployed for testing and demonstration on SPRINT3 assignment.
* Sprint Review, Restrospective, and Metrics completed (team/sprint3.md).


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
* Code Coverage above 40%
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

* Data shouldn't go away when I change tabs: Store any pages with information between tabs
* Let me change my itinerary: Add new locations by entering them or selecting them from data source(s), such as an SQL database based on some criteria, remove existing locations, reverse the order of the locations, rearrange the order of the locations, choose a new starting location
* Make my trip shorter: Allow an optional optimization, use the nearest neighbor algorithm to shorten the trip
* Validate all requests sent to the server and responses received by the client: Help find interoperability issues sooner, use JSON schemas to verify all requests received by the server, use JSON schemas to verify all responses received by the client
* Give me a friendly message if something goes wrong


We chose our epics this sprint by working top down from the TRIPCO repositories backlog. Primarily we hope to imporve our code quality and test coverage this sprint while also adding trip optimization functionality.

![optimizer_image](https://github.com/csucs314s19/t23/blob/master/team/images/optimization_diagram.png)
![optimizer_image](https://github.com/csucs314s19/t23/blob/master/team/images/Client_Diagram.png)

## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | 5 | 0 |
| Tasks |  20   | 2 | 
| Story Points |  25  | 2 | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| 3/4/19 | none | #138, #162, #182, #184 | none | 
| 3/6/19 | #194 | #138, #18,2 #184, #162 | none |
| 3/8/19 | #197, #180, #186, #199 | #173, #162, #104, #107 | Itinerary tests waiting on TA fix |
| 3/11/19 | #186 | #180, #173, #162, #107 | none |
| 3/15/19 | #213, #162, #206, #207, #180, #173 | #179, #106 | none |
| 3/25/19 | #179 | #106, #105, #185, #219 | none |
| 3/27/19 | #106, #223, #138, #220, #185 | #219, #107, #187 | none |


## Review (focus on solution and technology)

In this sprint, 

#### Completed epics in Sprint Backlog 

These Epics were completed.

* #178 User: Make my trip shorter
* #181 TripCo: validate all requests sent to the server and responses received by the client.
* #172 User: Data shouldn't go away when I change tabs.
* #183 User: Give me a friendly message if something goes wrong.

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.

* User: Let me change my itinerary: Ran out of time, time went to improving code climate score
*

#### What went well

The progress was consistent and quality before Spring Break. After Spring Break, we picked things back up again fairly well.


#### Problems encountered and resolutions

Some issues had some key other issues locked behind them, such as the Itinerary tests being locked behind a TA fix and home page tests being delayed by an issue that was not solved until halfway through the sprint. We solved this by assisting those who needed help and bug checking each others' code when necessary.


## Retrospective (focus on people, process, tools)

In this sprint, we worked at a nice pace and accomplished most of what we aimed to do. The process was much more streamlined than previous sprints, and those who did not know JavaScript are getting a handle on it by now. 
#### What we changed this sprint

We worked in pairs more often and helped each other when we needed.

#### What we did well

We worked at a consistent rate, continued to work even through delays, and worked together more.

#### What we need to work on

Checking each others' work in a timely manner when something does not pass checks and ensuring code passes tests before pushing.

#### What we will change next sprint 

We will increase how often we work in pairs and improve readability and maintainability of code.
