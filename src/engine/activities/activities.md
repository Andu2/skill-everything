# Event System

Map -> Locations -> Stations -> Activities -> Events -> Conditions/Effects

The game has a _Map_ of _Locations_

Locations have _Stations_, which may be the same as Stations in other Locations

Stations have _Activities_. While on an Activity, _work_ will be done on the Activity (one work per tick).

Activities have _Events_, each with _Conditions_ and _Effects_. If the Conditions are met, the Effects take place. Every effect has a baseWork representing how much work it takes, and a distribution representing how random the work requirement is.

Some activities are passive. The player can do one active Activity and any number of passive Activities.
The player is always doing a global "be" activity (as in, existing) and if they are at a location and/or station, they are doing a "be" passive activity for each of those as well.

The "null" Location is "anywhere", the "null" Station is "anyplace", and the "null" Activity is "idle".

## Locations

Locations have a list of permanent Stations which can be visited. Some Locations also have a build area where the player can construct new Stations or other buildings which provide benefits. 

While at a Location, the player is doing a special Activity that represents them being at that location.

## Work

While doing any Activity, the player is constantly putting in 1 work effort per tick toward _all_ Events for which the Conditions are met.

### Work Distributions

 * `"normal"`		- Random normal variable with standard deviation = 1/5 the baseWork
 * `"fixed"`		- Not random
 * `"binomial"`		- Binomial variable with mean = the baseWork (chance each tick is 1 / baseWork)
