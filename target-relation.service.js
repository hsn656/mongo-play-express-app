const targetRelationModel = require('./target-relation.model');


const seed = async () => {
  const result = await targetRelationModel.insertMany([
    // {
    //     targetId: "hsn-target",
    //     digitalAssetId: "HassanFB",
    //     type: "is"
    // },
    // {
    //     targetId: "hsn-target",
    //     digitalAssetId: "HassanLIn",
    //     type: "is"
    // },
    // {
    //     targetId: "hakeem-target",
    //     digitalAssetId: "HakeemFB",
    //     type: "is"
    // },
    // {
    //     targetId: "hakeem-target",
    //     digitalAssetId: "HakeemLIn",
    //     type: "is"
    // },
    // {
    //     targetId: "karim-target",
    //     digitalAssetId: "KarimFB",
    //     type: "is"
    // },
    // {
    //     targetId: "hsn-target",
    //     digitalAssetId: "HakeemFB",
    //     type: "friend"
    // },
    // {
    //     targetId: "hsn-target",
    //     digitalAssetId: "KarimFB",
    //     type: "relative"
    // },
    // {
    //     targetId: "hsn-target",
    //     digitalAssetId: "HakeemLIn",
    //     type: "related"
    // },
    // {
    //     targetId: "hakeem-target",
    //     digitalAssetId: "HassanFB",
    //     type: "colleague"
    // },
    // {
    //     targetId: "karim-target",
    //     digitalAssetId: "HassanFB",
    //     type: "friend"
    // },
    // {
    //     targetId: "karim-target",
    //     digitalAssetId: "HakeemFB",
    //     type: "relative"
    // },
    // {
    //     targetId: "karim-target",
    //     digitalAssetId: "HassanLIn",
    //     type: "colleague"
    // },
    // {
    //     targetId: "karim-target",
    //     digitalAssetId: "HakeemLIn",
    //     type: "friend"
    // },
  ]);

  return result;
}

const getR_R = async (targetId) => {

  const result = await targetRelationModel.aggregate([
    {
      $match: {
        targetId,
        type: {
          $ne: 'is'
        }
      }
    },
    {
      $graphLookup: {
        from: 'targetrelations',
        startWith: '$digitalAssetId',
        connectFromField: 'digitalAssetId',
        connectToField: 'digitalAssetId',
        as: 'relation',
        restrictSearchWithMatch: {
          targetId: { $ne: targetId },
          type: { $ne: 'is' }
        }
      }
    },
    {
      $unwind: "$relation"
    },
    {
      $group: {
        _id: '$relation.targetId',
        relations: {
          $push: {
            targetId,
            digitalAssetId: '$digitalAssetId',
            type: '$type',
            relatedTarget: '$relation.targetId',
            relatedTargetType: '$relation.type',
          }
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $unwind: "$relations"
    },
    {
      $replaceRoot: { newRoot: "$relations" }
    },
    // {
    //     $skip: 1
    // },
    // {
    //     $limit: 1
    // }
  ])

  return result;
}

const getDN_R = async (targetId) => {
  const result = await targetRelationModel.aggregate([
    {
      $match: {
        targetId,
        type: 'is'
      }
    },
    {
      $graphLookup: {
        from: 'targetrelations',
        startWith: '$digitalAssetId',
        connectFromField: 'digitalAssetId',
        connectToField: 'digitalAssetId',
        as: 'relation',
        depthField: 'depth',
        maxDepth: 2,
        restrictSearchWithMatch: {
          targetId: { $ne: targetId }
        }
      }
    },
    {
      $unwind: '$relation'
    },
    {
      $group: {
        _id: '$relation.targetId',
        relations: {
          $push: {
            targetId,
            digitalAssetId: '$digitalAssetId',
            type: '$type',
            relatedTarget: '$relation.targetId',
            relatedTargetType: '$relation.type',
          }
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $project: {
        targetId,
        relations: '$relations'
      }
    },
    // {
    //     $skip: 1
    // },
    // {
    //     $limit: 1
    // }
  ])

  return result;
}

const getR_DN = async (targetId) => {
  const result = await targetRelationModel.aggregate([
    {
      $match: {
        targetId,
        type: { $ne: 'is' }
      }
    },
    {
      $graphLookup: {
        from: 'targetrelations',
        startWith: '$digitalAssetId',
        connectFromField: 'digitalAssetId',
        connectToField: 'digitalAssetId',
        as: 'relation',
        depthField: 'depth',
        maxDepth: 2,
        restrictSearchWithMatch: {
          targetId: { $ne: targetId },
          type: 'is'
        }
      }
    },
    {
      $unwind: '$relation'
    },
    {
      $group: {
        _id: '$relation.targetId',
        relations: {
          $push: {
            targetId,
            digitalAssetId: '$digitalAssetId',
            type: '$type',
            relatedTarget: '$relation.targetId',
            relatedTargetType: '$relation.type',
          }
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $project: {
        targetId,
        relations: '$relations'
      }
    },
    // {
    //     $skip: 1
    // },
    // {
    //     $limit: 1
    // }
  ]);

  return result;
}

const getR_DN_V2 = async (targetId, relatedTargetIds) => {
  const result = await targetRelationModel.aggregate([
    {
      $match: {
        targetId,
        type: { $ne: 'is' }
      }
    },
    {
      $graphLookup: {
        from: 'targetrelations',
        startWith: '$digitalAssetId',
        connectFromField: 'digitalAssetId',
        connectToField: 'digitalAssetId',
        as: 'relation',
        depthField: 'depth',
        maxDepth: 2,
        restrictSearchWithMatch: {
          targetId: { $in: relatedTargetIds },
          type: 'is'
        }
      }
    },
    {
      $unwind: '$relation'
    },
    {
      $group: {
        _id: '$relation.targetId',
        relations: {
          $push: '$$ROOT'
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $project: {
        targetId,
        relations: '$relations'
      }
    },
    // {
    //     $skip: 1
    // },
    // {
    //     $limit: 1
    // }
  ]);

  return result;
}

const getDN_R_DN = async (targetId) => {
  const result = await getDN_R(targetId);
  const relatedTargetIds = result.map(e => e._id);
  const R_DN_result = await getR_DN_V2(targetId, relatedTargetIds);

  result.forEach(relation => {
    const R_DN_Relation = R_DN_result.find(item => item._id === relation._id && item.targetId === relation.targetId);
    if (R_DN_Relation)
      relation.relations.push(...R_DN_Relation.relations);
  })

  return result;
}

const getDN_R_V2 = async (targetId) => {
  const result = await targetRelationModel.aggregate([
    {
      $match: {
        targetId,
        type: 'is'
      }
    },
    {
      $graphLookup: {
        from: 'targetrelations',
        startWith: '$digitalAssetId',
        connectFromField: 'digitalAssetId',
        connectToField: 'digitalAssetId',
        as: 'relation',
        depthField: 'depth',
        maxDepth: 2,
        restrictSearchWithMatch: {
          targetId: { $ne: targetId }
        }
      }
    },
    {
      $unwind: '$relation'
    },
    {
      $project: {
        from: targetId,
        to: '$relation.targetId',
        type: 'DN-R',
        digitalAssetId: '$relation.digitalAssetId',
        relation: '$relation.type'
      }
    },
    // {
    //   $group: {
    //     _id: '$relation.targetId',
    //     relations: {
    //       $push: '$$ROOT'
    //     },
    //     count: {
    //       $sum: 1
    //     }
    //   }
    // },
    // {
    //   $sort: { count: -1 }
    // },
    // {
    //   $project: {
    //     targetId,
    //     relations: '$relations'
    //   }
    // },
    // {
    //     $skip: 1
    // },
    // {
    //     $limit: 1
    // }
  ])

  return result;
}

module.exports = {
  seed,
  getR_R,
  getDN_R,
  getR_DN,
  getDN_R_DN,
  getDN_R_V2
}
