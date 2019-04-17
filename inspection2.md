# Inspection - Team 23 

| Inspection | Details |
| ----- | ----- |
| Subject | ItineraryTable.js: lines 39-81, Application.js |
| Meeting | Date: 04/17/19, Time: 3:00 PM, Location: Canvas Stadium |
| Checklist | *reference, URL, etc.* |

### Roles

| Name | Preparation Time |
| ---- | ---- |
| Timothy Rooney | 33 minutes |
| Caleb Tong | 25 minutes |
|  Kurt Wimer | 25 minutes |

### Problems found

| file:line | problem | hi/med/low | who found | github#  |
| --- | --- | :---: | :---: | --- |
| ItineraryTable.js:39 | checks that a place equals 0 | med | Tim | |
| ItineraryTable.js:70-74 | very similar code could be function-formatted | low | Tim | |
| ItineraryTable.js:81 | Labels are hard-coded and missing some labels | low | Tim | |
| ItineraryTable.js:60 | Table variables' constraints affects mobile experience | low | Tim | |
| Application.js:22-52 | Very long state, decrease it as much as possible and change those calling this state to check if undefined | high | Caleb |  |
| Application.js:38-44 | HeaderOptions are hardcoded | low | Caleb |  |
| Application.js:83-100 | Using switch statement, use function calling instead | med | Caleb |  |
| Application.js:169 & 174 | Unnecessary console.log statements | low | Caleb |  |
| Calculator.js:95-140 | calculateDistance() is an extremely long function that needs to be broken down into smaller ones as it has very low readability | med | Josh |  |
| Calculator.js:96 | Needs updating to use Parsing.js to check coordinates | low | Josh |  |
| Calculator.js:142-149 | validateCoordinates() should be deleted or replaced by Parsing.js functions | low | Josh |  |
| Calculator.js:151-153 | updateCalculatorInput() could be deleted as it's only called in one place but it does slightly increase readablility so maybe not | low | Josh |  |
| CustomUnit.js:17-19 | Unneccessary binds | low | Kurt | |
| CustomUnit.js:23 | Commented out code | high | Kurt |  |
| CustomUnit.js:45/62 | Duplicate code | med | Kurt |  |
| CustomUnit.js:107 | Potential error use try/catch | Kurt |  |
