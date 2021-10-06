import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const name = "demo"

// Gets all az's in current region
const my_availabilityzones = aws.getAvailabilityZones();
// Returns only 1st az name in region
export const availability_zone_used = my_availabilityzones.then(az =>az.names[0])

const my_ebs_volume = new aws.ebs.Volume(`${name}-ebs-volume`, {
    availabilityZone: availability_zone_used,
    encrypted: true,
    size: 10,
    tags: {
        Name: "HelloWorld",
    },
});

const number_of_snapshots_to_take = 2;

let snapshots_ids = [] ;
for (let i = 0; i < number_of_snapshots_to_take; i++)
{   
    let dateTime = new Date()
    const ebs_volume_snapshot = new aws.ebs.Snapshot(`${name}-snapshot-${i}`, {
    volumeId: my_ebs_volume.id,
    tags: {
        Name: `HelloWorld_snap_${i}`,
        Date: `${dateTime}`,
    },
    }
    //,{ protect: true}  // This line needs to uncommented to make sure your snapshots stay.  You won't be able to destroy stack
    //,{ protect: false} // Uncomment this line if you need to destroy your snapshots also.
    );
    snapshots_ids.push(ebs_volume_snapshot.id)
    
}

export const number_of_snapshots_taken = number_of_snapshots_to_take;
export const ebs_snapshots_id = snapshots_ids;