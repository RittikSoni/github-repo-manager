import axios from "axios";
import React, { useState } from "react";

const HomeScreen = () => {
  const [cIndex, setCIndex] = useState();
  const [repos, setRepos] = useState([]);
  const [branches, setBranches] = useState([]);
  const [issues, setIssues] = useState([]);
  const [isBranches, setIsBranches] = useState(true);

  const box = async () => {
    // Can also use dialog box or use any react library which will be quick way to implement that like MUI library dialog component
    let owner = window.prompt("Owner");
    let repo = window.prompt("Repo");
    await getRepos(owner, repo);
  };
  const getRepos = async (owner, repo) => {
    try {
      await axios
        .get(`https://api.github.com/repos/${owner}/${repo}`)
        .then((value) => {
          setRepos((prev) => [value.data, ...prev]);
        });
    } catch (err) {
      alert(err);
    }
  };
  const getBranches = async (owner, repo) => {
    try {
      await axios
        .get(`https://api.github.com/repos/${owner}/${repo}/branches`)
        .then((value) => {
          setBranches(value.data);
        });
      await getIssues(owner, repo);
    } catch (err) {
      alert(err);
    }
  };
  const getIssues = async (owner, repo) => {
    try {
      await axios
        .get(`https://api.github.com/repos/${owner}/${repo}/issues`)
        .then((value) => {
          setIssues(value.data);
        });
    } catch (err) {
      alert(err);
    }
  };

  const removeRepo = () => {
    if (cIndex !== undefined) {
      setRepos((prevArr) => prevArr.filter((_, i) => i !== cIndex));
      setBranches([]);
      setIssues([]);
      setCIndex();
    } else {
      alert("Nothing to do. Please add a Repo first.");
      return;
    }
  };

  return (
    <div className="flex">
      <div className="w-[40%] h-screen overflow-y-scroll">
        {repos.map((v, index) => {
          return (
            <div
              className="border m-2 p-2 cursor-pointer"
              onClick={() => {
                getBranches(v.owner.login, v.name);
                setCIndex(index);
              }}
            >
              <h1 className="text-xl font-semibold">{v.name}</h1>
              <h1 className="font-light">{v.description}</h1>
            </div>
          );
        })}
      </div>

      <div className="w-[60%] h-screen">
        <div className="flex justify-end pr-4 place-content-center">
          <div className="flex pr-10 font-semibold">
            Github Repo manager - By Rittik Soni
          </div>
          <div
            className="flex justify-end cursor-pointer border p-2 mr-2 hover:bg-red-500"
            onClick={() => removeRepo()}
          >
            Delete
          </div>
        </div>
        <div>
          <div>
            <div className="flex border">
              {isBranches ? (
                <div
                  className="border p-2 cursor-pointer bg-green-500"
                  onClick={() => setIsBranches(true)}
                >
                  Branches
                </div>
              ) : (
                <div
                  className="border p-2 cursor-pointer"
                  onClick={() => setIsBranches(true)}
                >
                  Branches
                </div>
              )}
              {isBranches ? (
                <div
                  className="border p-2 cursor-pointer"
                  onClick={() => setIsBranches(false)}
                >
                  Issues
                </div>
              ) : (
                <div
                  className="border p-2 cursor-pointer bg-green-500"
                  onClick={() => setIsBranches(false)}
                >
                  Issues
                </div>
              )}
            </div>
            {isBranches ? (
              <div className="overflow-y-scroll max-h-[90vh]">
                {branches.map((e) => {
                  return (
                    <div className="border p-2 m-2">
                      <h1 className="text-xl">{e.name}</h1>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                {issues.map((e) => {
                  return (
                    <div className="border p-2 m-2">
                      <h1 className="text-xl">{e.title}</h1>
                      <div className="flex pt-2">
                        <img
                          src={e.user.avatar_url}
                          alt="Author"
                          className="rounded-full w-8"
                        />

                        <h1 className="text-xl ml-2">{e.user.login}</h1>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        onClick={() => box()}
        className="rounded-full absolute top-[90%] left-4 bg-yellow-300 p-2 cursor-pointer"
      >
        {/* We can also use react "+" icon here instead of "Add" */}
        Add
      </div>
    </div>
  );
};

export default HomeScreen;
