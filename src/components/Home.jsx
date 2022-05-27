import { useState, useRef } from "react";
import { webClient, getRecord } from "../utils/identity";
import { Modal } from "@mantine/core";
import Auth from "./Auth";
import Create from "./Create";
export default function Home({ verified, setVerified }) {
  const [bio, setBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [name, setName] = useState("");
  const [profile, setProfile] = useState({});
  const [ProfileImage, setProfileImage] = useState("");
  const [localDid, setDid] = useState(null);
  const [selfId, setSelfId] = useState(null);
  const [MFADone, setMFADone] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [opened, setOpened] = useState(false);
  const selfIdRef = useRef(null);
  const didRef = useRef(null);
  selfIdRef.current = selfId;
  didRef.current = localDid;

  async function connect() {
    const cdata = await webClient();
    const { id, selfId, error } = cdata;
    if (error) {
      console.log("error: ", error);
      return;
    }
    setDid(id);
    setSelfId(selfId);
    const data = await selfId.get("basicProfile", id);
    if (data) {
      setProfile(data);
      console.log("data: ", data);
    } else {
      setShowGreeting(true);
    }
    setLoaded(true);
  }

  async function updateProfile() {
    console.log("updateProfile");
    // if (!twitter && !bio && !name) {
    //   console.log("error... no profile information submitted");
    //   return;
    // }
    if (!selfId) {
      await connect();
    }
    const user = { ...profile };
    if (twitter) user.twitter = twitter;
    if (bio) user.bio = bio;
    if (name) user.name = name;
    if (ProfileImage) user.profileImage = ProfileImage;
    if (MFADone) user.MFADone = MFADone;

    await selfIdRef.current.set("basicProfile", user);
    setLocalProfileData();
    console.log("profile updated...");
  }

  async function readProfile() {
    try {
      const { record } = await getRecord();
      if (record) {
        setProfile(record);
      } else {
        setShowGreeting(true);
      }
    } catch (error) {
      setShowGreeting(true);
    }
    setLoaded(true);
  }

  async function setLocalProfileData() {
    console.log("setLocalProfileData");
    try {
      const data = await selfIdRef.current.get(
        "basicProfile",
        didRef.current.id
      );
      if (!data) return;
      setProfile(data);
      setShowGreeting(false);
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <div>
      <div
        style={{
          paddingTop: 50,
          width: 500,
          margin: "0 auto",
          display: "flex",
          flex: 1,
        }}
      >
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="text-5xl text-center">Decentralized Identity</h1>
          <p className="text-xl text-center mt-2 text-gray-400">
            BLOCKCHAIN BASED PUBLIC PKI PLATFORM WITH ZERO TRUST AUTHENTICATION
            FEATURES
          </p>

          {Object.keys(profile).length ? (
            <div className="mb-4">
              <img
                className="rounded-full w-12 m-8"
                src={profile.profileImage}
                alt=""
              />
              <h2 className="text-2xl font-semibold mt-6">{profile.name}</h2>
              <p className="text-gray-500 text-sm my-1">{profile.bio}</p>
              {profile.twitter && (
                <p className="text-lg	text-gray-900">
                  Follow me on Twitter - @{profile.twitter}
                </p>
              )}
            </div>
          ) : null}

          {!loaded && (
            <>
              <button
                onClick={connect}
                className="pt-4 shadow-md bg-purple-800 mt-4 mb-2 text-white font-bold py-2 px-4 rounded"
              >
                Authenticate
              </button>
            </>
          )}
          {loaded && showGreeting && (
            <p className="my-4 font-bold text-center">
              You have no profile yet. Please create one!
            </p>
          )}
          {loaded && (
            <>
              <input
                className="pt-4 rounded bg-gray-100 px-3 py-2"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="pt-4 rounded bg-gray-100 px-3 py-2"
                placeholder="DP"
                onChange={(e) => setProfileImage(e.target.value)}
              />
              <input
                className="pt-4 rounded bg-gray-100 px-3 py-2 my-2"
                placeholder="Bio"
                onChange={(e) => setBio(e.target.value)}
              />
              <input
                className="pt-4 rounded bg-gray-100 px-3 py-2"
                placeholder="Twitter username"
                onChange={(e) => setTwitter(e.target.value)}
              />
              <button
                className="pt-4 shadow-md bg-green-500 mt-2 mb-2 text-white font-bold py-2 px-4 rounded"
                onClick={updateProfile}
              >
                Update Profile
              </button>
              <button
                className="pt-4 shadow-md bg-blue-500 mb-2 text-white font-bold py-2 px-4 rounded"
                onClick={readProfile}
              >
                Read Profile
              </button>
              <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                // title="Introduce yourself!"
              >
                {!setMFADone ? (
                  <Auth verified={verified} setVerified={setVerified} />
                ) : (
                  <Create verified={verified} setVerified={setVerified} 
                  setMFADone={setMFADone} 
                  updateProfile={updateProfile}
                  />
                )}
              </Modal>
              <button onClick={() => setOpened(true)}>
                {setMFADone ? "Do the MFA Please" : "Enable MFA for the SSI"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
