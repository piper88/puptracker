# Model Calculations
-------------------------------------------------------------------
### Project
Initial User Inputs - `name`

### Line
Initial User Inputs - `name`
Update User Inputs - `actualTotalPups`

` expectedTotalPups`
  - calculated by # of breeding females x litter size (6)
`actualTotalPups`
  - displayed when user inputs actual litter size after birth dates
`expectedUsablePups`
  - calculated by # of breeding females in the line x litter size (6) x Usable %
  - Usable % will be determined per cage using male and female genotypes AND Expected DOB of each cage

### Cage
Initial User Inputs - `name`, `breedingStart`
Update User Inputs - `actualDOB`

`breedingEnd`
  - Calculated: Set end date for when youngest breeder in cage is 200 days old
`expectedDOB`
  - Calculated. 22 days after Breeding Start Date
`actualDOB`
  - Entered by user after litter is physically born. Will then reset "Breeding Start Date" so the subsequent litter in that cage will have an "Expected DOB" 22 days from then
`Number of Litters per month`
  - Calculated using Expected DOB
`expectedTotalPups`
  - Set by default to 6 per breeding female (can have more than 1 breeding female in a cage)
`expectedUsablePups`
  - Calculated by # of breeding females in the cage x litter size (6) per female in the cage x Usable %
  - Usable % will be determined by genotype of male and female(s)

### Mouse (Each cage will have either 2 or 3 mice)
Initial User Inputs - `name`, `geneticMakeup`, `DOB`

--------------------------------------------------------------------------

#### How to calculate Usable %
Must do calculation for each gene, then multiply the percentages together

##### Possible Gene Combos
Homo x WT = 100%
Homo x Homo = 100%
Homo x Het = 100%
Het x Het = 75%
Het x WT = 50%

##### Example Calculation:
    Male - Gene 1: Het
           Gene 2: WT
           Gene 3: WT

    Female - Gene 1: WT
             Gene 2: Het
             Gene 3: Het

        Male Gene 1 x Female Gene 1
        Male Gene 2 x Female Gene 2
        Male Gene 3 x Female Gene 3

        Het X WT = 50%
        WT x Het = 50%
        WT x Het = 50%

        50% x 50% x 50% = 12.5%

For this mating pair, expect 12.5% of pups in the litter to be of the desired genotype.

## User Workflow:
1. Create a project
    - Give the project a name
2. Add a line to the project
    - Give the line a name
3. Add a cage to the line
     - Give the cage a name
     - Give the cage a "Breeding Start Date"
4. Add Breeder(mouse) to the cage
    - Give name to the breeder
    - List zygosity of the breeder (Homo, Het or WT) for each of 2 or 3 genes
    - Input DOB of breeder
5. Add second Breeder to the cage
6. Add third Breeder to the cage if applicable

### What is visualized:
- Expected total pups born (only 1 line visualized at a time, but many cages)
- Actual total pups born for the month
- Expected Total Usable progeny
- Expected DOB of each litter - Can be edited to Actual DOB
