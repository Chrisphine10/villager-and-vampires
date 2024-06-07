import { collection, doc, addDoc, getDoc, updateDoc, query, where, getDocs, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";
import { real, db, auth, ref, set, onValue, update, off } from "../firebase";
import { nanoid } from 'nanoid';
import { toast } from 'react-toastify';


const streamGamePhase = (gameId, callback) => {
    try {
        const gameRef = ref(real, 'games/' + gameId);
        const listener = onValue(gameRef, (snapshot) => {
            const data = snapshot.val();
            callback(data.phase, data.subPhase);
        });

        // Return a function to stop the stream
        return () => off(gameRef, 'value', listener);
    } catch (error) {
        console.error("Error streaming game phase:", error);
    }
};


const changeGamePhase = async (gameId, newPhase, newSubPhase = null, reload = true) => {
    try {
        const updates = {
            reload: reload,
            phase: newPhase,
            subPhase: newSubPhase
        };
        await update(ref(real, 'games/' + gameId), updates);
        console.log(`Game ${gameId} phase updated to ${newPhase} with sub-phase ${newSubPhase}`);
    } catch (error) {
        console.error("Error updating game phase:", error);
    }
};

const triggerReload = async (gameId) => {
    try {
        const updates = {
            reload: true
        };
        await update(ref(real, 'games/' + gameId), updates);
        console.log(`Game ${gameId} reload triggered`);
    } catch (error) {
        console.error("Error triggering reload:", error);
    }
};

const streamTriggerReload = (gameId, callback) => {
    try {
        const triggerReloadRef = ref(real, 'games/' + gameId + '/reload');
        onValue(triggerReloadRef, (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
    } catch (error) {
        console.error("Error streaming trigger reload:", error);
    }
};

const createGameStream = async (gameId, hostId) => {
    try {
        await set(ref(real, 'games/' + gameId), {
            reload: true,
            phase: "day", // initial phase
            subPhase: null, // initial sub-phase
            hostId: hostId
        });
        console.log(`Game ${gameId} created successfully`);
    } catch (error) {
        console.error("Error creating game:", error);
    }
};


const createGame = async () => {
    try {
        const user = auth.currentUser;

        // Check if the user already has an active game
        const activeGamesQuery = query(
            collection(db, "games"),
            where("host_id", "==", user.uid),
            where("status", "==", true) // Assuming "true" indicates an active game
        );
        const activeGamesSnapshot = await getDocs(activeGamesQuery);

        if (!activeGamesSnapshot.empty) {
            const gameId = activeGamesSnapshot.docs[0].id;
            localStorage.setItem("gameId", gameId);
            console.log("Active game found:", localStorage.getItem("gameId"));
            toast.error("You already have an active game.");
            return null;
        }

        // Generate a unique game ID
        let gameCode;
        let gameExists = true;
        while (gameExists) {
            gameCode = nanoid(7);
            const gameSnapshot = await getDoc(doc(db, "games", gameCode));
            gameExists = gameSnapshot.exists();
        }

        // Add game data to Firestore
        var gameId = await addDoc(collection(db, "games"), {
            host_id: user.uid,
            game_code: gameCode,
            players: [],
            voting: [],
            killing: [],
            vampires: [],
            seer: null,
            villagers: [],
            killed: null,
            voted: null,
            winners: [],
            winnerTeam: null,
            isImmune: null,
            status: true
        });

        // Return the generated game ID
        console.log("Game created successfully", gameId.id);
        localStorage.setItem("gameCode", gameCode);
        await createGameStream(gameId.id, user.uid);
        return gameId.id;
    } catch (error) {
        toast.error(error.message);
        console.error(error);
        return null;
    }
};

const setPlayerRoles = async (gameId) => {
    try {
        const gameRef = doc(db, "games", gameId);
        const gameSnapshot = await getDoc(gameRef);

        if (gameSnapshot.exists()) {
            const gameData = gameSnapshot.data();
            const numPlayers = gameData.players.length;
            const playerIds = gameData.players;
            if (numPlayers > 3) {

                // Randomly select the seer
                const seerIndex = Math.floor(Math.random() * numPlayers);
                const seerId = playerIds.splice(seerIndex, 1)[0]; // Remove the seer from the playerIds list

                // Calculate the number of vampires based on the ratio
                const numVampires = Math.floor((numPlayers - 1) / 3); // Assuming 1 vampire for every 3 players

                // Randomly select vampires
                const vampireIds = [];
                for (let i = 0; i < numVampires; i++) {
                    const randomIndex = Math.floor(Math.random() * playerIds.length);
                    vampireIds.push(playerIds.splice(randomIndex, 1)[0]); // Remove the selected vampire from playerIds
                }

                for (let i = 0; i < playerIds.length; i++) {
                    addPlayerToList(gameId, "villagers", playerIds[i]);
                }
                addPlayerToList(gameId, "villagers", seerId);

                for (let i = 0; i < vampireIds.length; i++) {
                    addPlayerToList(gameId, "vampires", vampireIds[i]);
                }

                updateDoc(gameRef, {
                    seer: seerId,
                })

            }
            else {
                toast.error("Less Players than required");
                throw new Error("Less Players than required");
            }
        } else {
            throw new Error("Game does not exist");
        }
    } catch (error) {
        console.error("Error assigning roles: ", error);
        throw new Error("Failed to assign roles");
    }
};

const getPlayerRoles = async (gameId) => {

    const user = auth.currentUser;
    const playerId = user.uid;
    try {
        const gameRef = doc(db, "games", gameId);
        const gameSnapshot = await getDoc(gameRef);
        if (gameSnapshot.exists()) {
            const gameData = gameSnapshot.data();
            const villagers = gameData.villagers;
            const seer = gameData.seer;
            const vampires = gameData.vampires;
            if (vampires !== null && seer !== null) {
                for (let i = 0; i < villagers.length; i++) {
                    console.log(villagers[i]);
                    if (villagers[i] === playerId) {
                        if (playerId === seer) {
                            return "seer";
                        } else {
                            return "villager";
                        }
                    }
                }

                for (let i = 0; i < vampires.length; i++) {
                    if (vampires[i] === playerId) {
                        return "vampire";
                    }
                }
            } else {
                toast.error("Roles not assigned");
                return null;
            }
        } else {
            throw new Error("Game does not exist");
        }
    }
    catch (error) {
        toast.error(error.message);
        throw new Error("Failed to get player roles");
    }
}

const findGameByCode = async (gameCode) => {
    const gamesRef = collection(db, "games");
    const q = query(gamesRef, where("game_code", "==", gameCode));

    try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const gameDoc = querySnapshot.docs[0]; // Assuming game_code is unique, we take the first result
            return gameDoc.id;
        } else {
            console.log("No game found with the provided game code.");
            return null;
        }
    } catch (error) {
        console.error("Error finding game: ", error);
        return null;
    }
};

const getGame = async (gameId) => {
    try {
        const gameRef = doc(db, "games", gameId);
        const gameSnapshot = await getDoc(gameRef);
        if (gameSnapshot.exists()) {
            return gameSnapshot.data();
        } else {
            throw new Error("Game not found");
        }
    } catch (error) {
        console.error("Error getting game: ", error);
        throw new Error("Failed to get game");
    }
};

const cancelGame = async (gameId) => {
    try {
        // Update the game status to false
        const gameRef = doc(db, "games", gameId);
        await updateDoc(gameRef, {
            status: false
        });

        console.log("Game canceled successfully");

        return true; // Return true to indicate successful cancellation
    } catch (error) {
        toast.error(error.message);
        console.error(error);
        return false;
    }
};

const setKilledPlayer = async (gameId) => {
    try {
        const gameRef = doc(db, "games", gameId);

        const gameSnapshot = await getDoc(gameRef);
        var playerId = "";
        if (gameSnapshot.exists()) {
            const gameData = gameSnapshot.data();
            const killing = gameData.killing || {};

            let maxKills = 0;
            let usersWithMaxKills = [];

            for (const userId in killing) {
                if (killing.hasOwnProperty(userId)) {
                    const kills = killing[userId];
                    if (kills > maxKills) {
                        maxKills = kills;
                        usersWithMaxKills = [userId];
                    } else if (kills === maxKills) {
                        usersWithMaxKills.push(userId);
                    }
                }
            }

            console.log(`User(s) with the most kills: ${usersWithMaxKills.join(', ')}`);
            playerId = usersWithMaxKills[0];
        } else {
            throw new Error("Game does not exist");
        }

        await updateDoc(gameRef, {
            killed: playerId
        });
        console.log(`Player ${playerId} is now immune`);
    } catch (error) {
        console.error("Error setting isImmune: ", error);
    }

}
const setVotedPlayer = async (gameId) => {
    try {
        const gameRef = doc(db, "games", gameId);
        const gameSnapshot = await getDoc(gameRef);
        var playerId = "";

        if (gameSnapshot.exists()) {
            const gameData = gameSnapshot.data();
            const voting = gameData.voting || [];

            if (voting.length === 0) {
                console.log("No votes have been cast.");
                return null;
            }

            let maxVotes = 0;
            let playerWithMostVotes = null;

            // Iterate through the voting list to find the player with the most votes
            voting.forEach(vote => {
                if (vote.count > maxVotes) {
                    maxVotes = vote.count;
                    playerWithMostVotes = vote.userId;
                }
            });

            console.log(`Player with most votes: ${playerWithMostVotes} with ${maxVotes} votes.`);
            playerId = playerWithMostVotes;
        } else {
            throw new Error("Game does not exist");
        }

        await updateDoc(gameRef, {
            voted: playerId
        });
        // removePlayerFromList(gameId, "players", playerId);
        console.log(`Player ${playerId} is out of the game`);
        return playerId;
    } catch (error) {
        console.error("Error setting isImmune: ", error);
    }
}


const checkGameExists = async (gameId) => {
    try {
        const gameRef = doc(db, "games", gameId);
        const gameSnapshot = await getDoc(gameRef);
        return gameSnapshot.exists;
    } catch (error) {
        console.error("Error checking if game exists: ", error);
        throw new Error("Failed to check if game exists");
    }
};

const checkGameIsActive = async (gameId) => {
    try {
        const gameRef = doc(db, "games", gameId);
        const gameSnapshot = await getDoc(gameRef);
        const gameData = gameSnapshot.data();
        return gameData.status === true; // Assuming "true" indicates an active game
    } catch (error) {
        console.error("Error checking if game is active: ", error);
        throw new Error("Failed to check if game is active");
    }
};



const getUserGameId = async (userId) => {
    try {
        // Query games where the user is a player and the game is active
        const gamesQuery = query(
            collection(db, "games"),
            where("players", "array-contains", userId),
            where("status", "==", true) // Assuming "true" indicates an active game
        );
        const gamesSnapshot = await getDocs(gamesQuery);

        if (!gamesSnapshot.empty) {
            // If the user is found in at least one active game, return the game ID
            const gameData = gamesSnapshot.docs[0].data();
            return gameData.id;
        } else {
            // If the user is not found in any active games, return null
            return null;
        }
    } catch (error) {
        console.error("Error checking user's game: ", error);
        throw new Error("Failed to check user's game");
    }
};



// Function to vote for a user
const voteForUser = async (gameId, votedUserId) => {
    try {
        const gameRef = doc(db, "games", gameId);
        const gameSnapshot = await getDoc(gameRef);

        if (gameSnapshot.exists()) {
            const gameData = gameSnapshot.data();
            let voting = gameData.voting || [];

            // Find the user in the voting list
            let userVote = voting.find(vote => vote.userId === votedUserId);

            // Increment the vote count for the voted user or add the user if they don't exist in the list
            if (userVote) {
                userVote.count += 1;
            } else {
                voting.push({ userId: votedUserId, count: 1 });
            }

            // Update the game document with the new voting list
            await updateDoc(gameRef, { voting: voting });

            console.log(`User ${votedUserId} has been voted. Current votes: ${userVote ? userVote.count : 1}`);
            return true;
        } else {
            throw new Error("Game does not exist");
        }
    } catch (error) {
        console.error("Error voting for user: ", error);
        throw new Error("Failed to vote for user");
    }
};


// Function to vote to kill a user
const killUser = async (gameId, killedUserId) => {
    try {
        const gameRef = doc(db, "games", gameId);
        const gameSnapshot = await getDoc(gameRef);

        if (gameSnapshot.exists()) {
            const gameData = gameSnapshot.data();
            let killing = gameData.killing || [];

            // Find the user in the killing list
            let userKill = killing.find(kill => kill.userId === killedUserId);

            // Increment the kill count for the killed user or add the user if they don't exist in the list
            if (userKill) {
                userKill.count += 1;
            } else {
                killing.push({ userId: killedUserId, count: 1 });
            }

            // Update the game document with the new killing list
            await updateDoc(gameRef, { killing: killing });

            console.log(`User ${killedUserId} has been targeted. Current kills: ${userKill ? userKill.count : 1}`);
            return true;
        } else {
            throw new Error("Game does not exist");
        }
    } catch (error) {
        console.error("Error killing user: ", error);
        throw new Error("Failed to kill user");
    }
};


const addPlayerToList = async (gameId, listName, playerId) => {
    const gameRef = doc(db, "games", gameId);

    try {
        await updateDoc(gameRef, {
            [listName]: arrayUnion(playerId)
        });
        console.log(`Player ${playerId} added to ${listName}`);
    } catch (error) {
        console.error("Error adding player to list: ", error);
    }
};

const setIsImmune = async (gameId, playerId) => {
    const gameRef = doc(db, "games", gameId);

    try {
        await updateDoc(gameRef, {
            isImmune: playerId
        });
        console.log(`Player ${playerId} is now immune`);
    } catch (error) {
        console.error("Error setting isImmune: ", error);
    }
};


const removePlayerFromList = async (gameId, listName, playerId) => {
    const gameRef = doc(db, "games", gameId);

    try {
        await updateDoc(gameRef, {
            [listName]: arrayRemove(playerId)
        });
        console.log(`Player ${playerId} removed from ${listName}`);
    } catch (error) {
        console.error("Error removing player from list: ", error);
    }
};



const updatePlayer = async (userId, attribute, value) => {
    try {
        const playerRef = doc(db, "players", userId);
        await updateDoc(playerRef, { attribute: value });
        console.log(`Player ${userId} attribute ${attribute} to ${value}`);
        return true;
    } catch (error) {
        console.error("Error updating player : ", error);
        throw new Error("Failed to update player ");
    }
};

const setPlayer = async (userId, attribute, value) => {
    try {
        const playerRef = doc(db, "players", userId);
        await setDoc(playerRef, { attribute: value });
        console.log(`Player ${userId} attribute ${attribute} to ${value}`);
        return true;
    } catch (error) {
        console.error("Error setting player : ", error);
        throw new Error("Failed to set player ");
    }
};

const getPlayer = async (userId) => {
    try {
        const playerRef = doc(db, "players", userId);
        const playerSnapshot = await getDoc(playerRef);
        if (playerSnapshot.exists()) {
            const playerData = playerSnapshot.data();
            return playerData;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting player: ", error);
        return null;
    }
};



export { getPlayer, getPlayerRoles, setVotedPlayer, setPlayerRoles, setKilledPlayer, findGameByCode, streamTriggerReload, setPlayer, getGame, triggerReload, setIsImmune, removePlayerFromList, addPlayerToList, createGame, cancelGame, checkGameExists, checkGameIsActive, updatePlayer, killUser, getUserGameId, voteForUser, createGameStream, streamGamePhase, changeGamePhase };