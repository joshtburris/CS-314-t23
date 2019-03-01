# Sprint 2 - 23 - Byte Me

## Goal

### A map and itinerary!
### Sprint Leader: Caleb Tong

## Definition of Done

* Version in pom.xml should be `<version>2.0</version>` for your final build for deployment.
* Increment release `v2.0` created on GitHub with appropriate version number and name.
* Increment deployed for testing and demonstration on SPRINT2 assignment.
* Sprint Review and Restrospectives completed (team/sprint2.md).


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

* \#29 Show me a map and itinerary for my trip: display relevant itinerary information and load/save map to file
* \#30 Enter latitudes and longitudes in the calculator using degree-minutes-seconds and other formats
* \#32 The calculator data shouldn't go away when units change
* \#6 I may need distances in other units of measure: allow user to define custom units
* \#39 Let me Change my itinerary

Key planning decisions for this sprint include ...


## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | 5 | 4 |
| Tasks |  29  | 28 | 
| Story Points | 25 | 26 | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| 2/11/19 |  | planning| *none* |
| 2/13/19| |94, 92, 97, 98, 100| *none* | 
| 2/15/19|108, |92, 97, 98, 108| *none* |
| 2/18/19|100, 108|92, 97, 98, 111, 114| 92 |
| 2/19/19|100, 108|70, 92, 97, 98, 102, 111, 114| 92 |
| 2/20/19|97, 102, 114|70, 92, 98, 111| 92 |
| 2/21/19|92, 97, 102, 114|70, 95, 98, 111| *none* |
| 2/22/19|70, 92, 97, 98, 102, 114|95, 111| *none* |
| 2/25/19|70, 92, 95, 97, 98, 102, 114, 136|111, 127, 133, 134, 136, 138| *none* |
| 2/26/19|70, 92, 95, 97, 98, 102, 114, 133, 134, 136|111, 127, 138, 141, 148| *none* |
| 2/27/27|70, 92, 95, 97, 98, 102, 111, 133, 134, 136, 141, 144, 148, 150|127, 144, 146, 150, 156| *none* |
| 2/28/27|70, 92, 95, 97, 98, 102, 111, 127, 133, 134, 136, 141, 144, 146, 148, 150, 156| *none* | *none* |


## Review (focus on solution and technology)

In this sprint, the part where our team faced the most difficulty is on issue #92. It was very tricky as the teammate assigned to it had lots of difficulties trying to solve it as there weren't many examples to be found on the web (according to him). It took us by surprise as well that some other tasks that were assigned were blocked because the first task wasn't finished. But it got completed eventually.

#### Completed epics in Sprint Backlog 

These Epics were completed.

* *#6 User: I may need distances in other units of measure*
* *#29 Show me a map and itinerary for my trip*
* *#30 Enter latitudes and longitudes in the calculator using degree-minute-second and other formats*
* *#32 The calculator data shouldn't go away when units change*
* *#39 Let me change my itinerary*

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.

* *## User: Let me change my itinerary: Insufficient information to complete epic*

#### What went well

The epic "Enter latitudes and longitudes in the calculator using degree-minute-second and other formats" pretty much needed some research to find the library that accepts the unique formats. 
The epic "User: I may need distances in other units of measure" was a bit tricky, but after figuring out that it required the use of list to push up the units, everything started falling into place.


#### Problems encountered and resolutions

The epic "Show me a map and itinerary for my trip" took us by surprise on how long it needed to complete its initial portion. A teammate used 1 and a half weeks to complete this because of how scarce this specific information is online.


## Retrospective (focus on people, process, tools)

In this sprint, pretty much everything at the latter end went well. The front part of the sprint was not that good as we took too much time to complete the uploading of the file to the webpage. We took 1 and a half weeks to get just that done (merged to master on the Wednesday afternoon SP2 Check was due), causing us to not have enough time to complete what was required of us in SP2 Check, leading to low marks for our grade on that. Besides that, everything managed to pick up pace and get done.

#### What we changed this sprint

* Our changes for this sprint included that we started using squash and merge so as to tie our issue numbers to our pull requests. 
* We managed to get a better estimate on how many tasks are needed.

#### What we did well

* We managed to finish most of the epics that were up, only unable to do the one epic that had insufficient information.

#### What we need to work on

* We could improve on how to get started on the right foot and not require so much time for one task.
* Better communication during our working time so that the time differences between the pull requests and merges are not too far apart.

#### What we will change next sprint 

* We will change and impliment a buddy system so that we can work better and keep check of each other on our progress.
