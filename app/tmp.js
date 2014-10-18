var a = {
  users: {
    "userid1234": {
      "profile": {
        "email": "",
        "address": ""
      },
      "profilePublic": {
        "name": "",
        "birthdate": ""
      },
      "subscriptions": {
        "free": false,
        "silver": false, // If true, then it is active only if admin approves it in subscriptionApprovals
        "gold": false
      },
      "subscriptionApprovals": { // For admin to approve
        silver: false,
        gold: false
      },
      "comments": {
        userPublic: "",
        userForAdmin: "",
        userPrivate: "",
        adminPublic: "",
        adminForUser: "",
        adminPrivate: ""
      }
    }
  }
};


var b = {
  usersPublic: {
    },
  usersLimited: {
    },
  usersAdmin: {
  }
};
