import { useState, useRef, useEffect } from "react";
import { webClient, getRecord } from "../utils/identity";
import { Modal } from "@mantine/core";
import { Button, InputWrapper, Input } from "@mantine/core";
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
  const [MFADone, setMFADone] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

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
      if (data.MFADone) setMFADone(data.MFADone);
      console.log("data: ", data);
    } else {
      setShowGreeting(true);
    }
    setLoaded(true);
    setLoading(false);
  }

  async function updateProfile(mfa = 0) {
    // const form = e.target;
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
    // eslint-disable-next-line eqeqeq
    if (mfa != 0) user.MFADone = mfa;

    await selfIdRef.current.set("basicProfile", user);
    setLocalProfileData();
    console.log("profile updated...");
    // form.reset();
  }
  useEffect(() => {
    console.log("MFADone", MFADone);
  }, [MFADone]);

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
    setLoading(false);
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
      <div class="h-screen flex w-4/5 m-auto bg-grey-lighter">
        <div
          class="hidden lg:flex w-full lg:w-1/2 login_img_section
          justify-around items-center"
        >
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
                BLOCKCHAIN BASED PUBLIC PKI PLATFORM WITH ZERO TRUST
                AUTHENTICATION FEATURES
              </p>
              {Object.keys(profile).length ? (
                <div className="card bg-[#15263F] w-80 h-[32rem] rounded-xl p-6 space-y-4 justify-center m-auto mb-10">
                  <a href="#">
                    <img
                      className="w-full h-64 rounded-md transition hover:bg-cyan-300"
                      src={profile.profileImage}
                      alt=""
                    />
                  </a>
                  <div id="description" className="space-y-4 overflow-hidden">
                    <a href="#">
                      <h2 className="text-white font-semibold text-xl transition hover:text-cyan-300">
                        {profile.name}
                      </h2>
                    </a>
                    <p className="text-slate-500 text-sm select-none">
                      Bio:{profile.bio}
                    </p>
                    <div className="flex items-center justify-between font-semibold text-sm border-b border-slate-500 pb-6">
                      <span
                        id="price"
                        className="text-cyan-300 flex justify-between items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 320 512"
                          fill="#67E7F9"
                        >
                          <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
                        </svg>
                        0.041 ETH
                      </span>
                    </div>
                    <div className="flex text-sm items-center">
                      <img
                        src="https://i.pravatar.cc/30?img=56"
                        alt="avatar"
                        className="rounded-full border border-white"
                      />
                      <span className="ml-2 text-slate-500">
                        Twitter:
                        <a
                          href="#"
                          className="text-gray-300 transition hover:text-cyan-300"
                        >
                          @{profile.twitter}
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div class="flex w-full lg:w-1/2 justify-center items-center bg-white space-y-8">
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
              {!loaded && (
                <>
                  <Button
                    onClick={() => {
                      connect();
                      setLoading(true);
                    }}
                    className="flex mx-auto text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                    loading={loading}
                  >
                    Authenticate
                  </Button>
                </>
              )}
              {loaded && showGreeting && (
                <p className="my-4 font-bold text-center">
                  You have no profile yet. Please create one!
                </p>
              )}
              {loaded && (
                <>
                  <button
                    className={`flex mx-auto text-white ${
                      verified ? "bg-green-600" : "bg-red-500"
                    } border-0 py-2 px-8 focus:outline-none hover:bg-green-600  rounded text-lg`}
                    onClick={() => setOpened(true)}
                  >
                    {MFADone
                      ? verified
                        ? "Verified"
                        : "Do the MFA Please"
                      : "Enable MFA for the SSI Wallet"}
                  </button>
                  <InputWrapper
                    id="input-demo"
                    required
                    label="Name:"
                    description="Please enter you Name"
                    error="Your Name: Start with a capital letter"
                  >
                    <Input
                      id="Name"
                      placeholder="Name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </InputWrapper>

                  <InputWrapper
                    id="input-demo"
                    required
                    label="DP:"
                    description="Please provide a profile image"
                    error="Your DP: Please provide a valid image"
                  >
                    <Input
                      id="DP"
                      placeholder="Profile Photo"
                      onChange={(e) => setProfileImage(e.target.value)}
                    />
                  </InputWrapper>

                  <InputWrapper
                    id="input-demo"
                    required
                    label="Bio"
                    description="Please provide a line about yourself"
                    error="Your a coder ?"
                  >
                    <Input
                      id="Bio"
                      placeholder="Your Bio"
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </InputWrapper>
                  <InputWrapper
                    id="input-demo"
                    required
                    label="Twitter"
                    description="Please provide a link to your twitter profile"
                    error="Do you use Twitter"
                  >
                    <Input
                      id="Twitter"
                      placeholder="Twitter username"
                      onChange={(e) => setTwitter(e.target.value)}
                    />
                  </InputWrapper>

                  <button
                    className="pt-4 shadow-md bg-green-500 mt-2 mb-2 text-white font-bold py-2 px-4 rounded"
                    onClick={(e) => {
                      updateProfile(e);
                      setUpdateLoading(true);
                    }}
                    loading={updateLoading}
                  >
                    Update Profile
                  </button>

                  <Modal
                    centered
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title="Multi Factor Authentication"
                  >
                    {MFADone ? (
                      <Auth
                        verified={verified}
                        setVerified={setVerified}
                        setOpened={setOpened}
                      />
                    ) : (
                      <Create
                        verified={verified}
                        setVerified={setVerified}
                        setMFADone={setMFADone}
                        updateProfile={updateProfile}
                      />
                    )}
                  </Modal>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
