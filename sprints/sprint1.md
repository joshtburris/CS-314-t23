# Sprint 1 - 23 - Byte Me

## Goal

### Distance Calculator!
### Sprint Leader: Joshua Burris

## Definition of Done

* Web application deployed on the production server (black-bottle.cs.colostate.edu).
* Version in server/pom.xml should be `<version>1.0</version>`.
* Product Increment release `v1.0` created on GitHub.
* Sprint Review and Restrospectives completed (sprints/sprint#.md).

## Policies

* All commits include a task/issue number.
* Someone else approves and merges commits, you may not merge your own changes.
* No commits to master

## Plan

Epics planned for this release.

* \#4 I'd like to know who to thank for this tool
* \#5 I want to compute the distance between two locations on the planet
* \#6 I may need distances in other units of measure
* \#7 Application should identify the client and server currently in use
* \#8 Use a standard logging system on the server
* \#16 I want to know where I am on the map


## Review

#### Completed epics in Sprint Backlog 
* \#4 I'd like to know who to thank for this tool: Was easy enough once we had a general template
* \#5 I want to compute the distance between two locations on the planet: This was the largest epic but broke down into
compenents fairly easily
* \#7 Application should identify the client and server currently in use: trivial changes were required
* \#8 Use a standard logging system on the server: Most of the work was already done. Some of the specifications seemed 
too strict, specifically  **ALL** server classes require a toString method even those which don't hold any data.
* \#16 I want to know where I am on the map: Defaults to CSU oval if location permissions are denied. 

#### Incomplete epics in Sprint Backlog 
* \#6 I may need distances in other units of measure: Permission given to push back to sprint 2

#### What went well
* Accomplished all of the epics designated for this sprint

#### Problems encountered and resolutions
* No one knew javascript, lots of analysis of existing code and googling
* Some commits were not properly tied to issues, this will be discussed and better proccess created for sprint 2
* Proper estimates were never made, greater discussion of this will happen in sprint 2 planning
* Most of us had never used intellij before, some of us committed to master in the first couple of commits

## Retrospective

#### What went well
* The team had no issues with butting-heads
* Pace of progress was good, there was not a lot left for the last few days

#### Potential improvements
* We had many duplicate tasks created during this sprint 
* We need better separation of work
* Completion of some trivial tasks could happen in a more timely manner such as the about information
* Better identification of how merges should be done

#### What we will change next time
* Greater discussion of necessary sub-tasks and their estimated work amount
* We should do a better job of recording in person meetings and sending important info to Kelyn
* Properly tie commits to issues
