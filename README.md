# Mouse Tracker
Track the breeding cycles of experimental mice to gain genetic information to be used in neural studies.
 -  Track when pups (baby mice) are born in a calendar - expected date of birth, actual date of birth,
 - each mice has an array of 3 genes, each of which can be heterozygous, homozygous, and wild type
 - this determines the genotype of the progeny of each of the children
 - used by two groups of people
    1. Breeders - Make changes to every model, GET, POST, PUT, DELETE
    - these people are responsible for setting up cages / breeding
    2. Scientists - Take mice and do experiments - All they can do is GET - just see information about pups (when litters are born and of what genotypes)

 ### Outputs
- Expected litter dates (projected date of birth on cage
- % usable progeny calculated from gene makeup of breeders
- Expected number of useable progeny - certain genotypes are ideal for various studies
- Breeding start
- Breeding end
- Expected total pups per line (info form genetic test) - refers to the genes that are present

### Routes
Project -> Line -> Cage -> Mouse
1. Project - GET, POST, PUT, DELETE
2. Line - GET, POST, PUT, DELETE
3. Cage - GET, POST, PUT, DELETE
4. Mouse - GET< POST, PUT, DELETE
