import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { error } from 'firebase-functions/lib/logger';

admin.initializeApp();

export const onConversationCreated = functions.firestore.document("Conversations/{conversationID}").onCreate(async (snapshot, context) => {
    let data = snapshot.data();
    let conversationID = context.params.conversationID;
    if (data){
        let members = data.members;
        for (let index =0; index < members.length; index++){
            let currentUserID = members[index];
            let remainingUserIDs = members.filter((u:string) => u !== currentUserID)
            remainingUserIDs.forEach((m: string) => {
                console.log(m,'mmmm')
                let docRef = admin.firestore().collection("Users").doc(m);
                let getDoc = docRef.get().then(doc => {
                    if (doc){
                        console.log(doc,"YEsss");
                    }
                }).catch(err => {
                    console.log('Error getting doc', err);
                })
                console.log(getDoc,'getDoccccc');
                return admin.firestore().collection("Users").doc(m).get().then((_doc) => {
                    let userData = _doc.data();
                    console.log(userData,'userdataaaa');
                    if (userData) {
                        return admin.firestore().collection("Users").doc(currentUserID).collection("Conversations").doc(m).create({
                            "conversationID" : conversationID,
                            "image": userData.image,
                            "name": userData.name,
                            "unseenCount": 0
                        }).catch(() => error);
                    }
                    return null;
                }).catch(() => { return null});
            });
        }
    }
    return null;
});


export const onConversationUpdated = functions.firestore.document("Conversations/{conversationID").onUpdate((change, context) => {
    let data = change?.after.data();
    if (data){
        let members = data.members();
        let lastMessage = data.messages[data.messages.length - 1];
        for (let index = 0;index < members.length; index++){
            let currentUserID = members[index];
            let remainingUserIDs = members.filter((u: string) => u !== currentUserID);
            remainingUserIDs.forEach((u:string) => {
                return admin.firestore().collection("Users").doc(currentUserID).collection("Conversations").doc(u).update({
                    "lastMessage": lastMessage.message,
                    "timestamp": lastMessage.timestamp,
                    "unseenCount": admin.firestore.FieldValue.increment(1),
                });
                
            });
            
        }
    }
});