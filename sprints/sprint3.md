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



***(Include a discussion of your plan with key diagrams here and remove this!)***


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


## Review (focus on solution and technology)

In this sprint, ...

#### Completed epics in Sprint Backlog 

These Epics were completed.

* *## epic title: comments*
* 

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.

* *## epic title: explanation*
*

#### What went well

The ...


#### Problems encountered and resolutions

The ...


## Retrospective (focus on people, process, tools)

In this sprint, ...

#### What we changed this sprint

Our changes for this sprint included ...

#### What we did well

We ...

#### What we need to work on

We could improve ...

#### What we will change next sprint 

We will change ...
