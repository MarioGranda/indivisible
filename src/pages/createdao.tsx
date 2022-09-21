import { ChangeEvent, FC, useCallback, useState } from "react";
import FixedContainer from "@/client/layouts/FixedContainer";
import Input from "@/client/components/Input";
import TextArea from "@/client/components/TextArea";
import { ContentFileType, Dao } from "@/shared/models";
import FileInput from "@/client/components/FileInput";
import axios from "axios";
import { useDispatch } from "react-redux";
import getProvider from "@/shared/utils/getProvider";
import { deployDao } from "@/client/utils/createDao";
import {
  openPendingTransactionNotification,
  openTransactionCompleteNotification,
  openTransactionFailedNotification,
} from "@/client/redux/actions/notification";
import { useRouter } from "next/router";
import Toggle from "@/client/components/Toggle";
import Select from "@/client/components/Select";
import { findAllDaos } from "@/backend/repositories/dao";
import { MdAdd, MdClose } from "react-icons/md";
import {
  generateMerkleRoot,
  generateMerkleTree,
} from "@/shared/utils/merkleTree";

interface Props {
  daos: Dao[];
}

export const CreateDao: FC<Props> = ({ daos }) => {
  const [daoImage, setDaoImage] = useState<ContentFileType | null>(null);
  const [tokenImage, setTokenImage] = useState<ContentFileType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDao, setSelectedDao] = useState(null);
  const [childrenDaos, setChildrenDaos] = useState<Dao[]>([]);

  const dispatch = useDispatch();
  const router = useRouter();

  const [formInput, setFormInput] = useState({
    name: "",
    description: "",
    tokenName: "",
    tokenSymbol: "",
    minQuorum: undefined,
    minVotingPeriod: undefined,
    minConsensusPeriod: undefined,
    mintAmount: undefined,
    daoImage: "",
    tokenImage: "",
    isCoalitionDao: false,
  });

  const addChildrenDao = () => {
    if (childrenDaos.find((d) => d.id === Number(selectedDao))) {
      return;
    }
    setChildrenDaos([
      ...childrenDaos,
      daos.find((d) => d.id === Number(selectedDao)),
    ]);
  };

  const removeChildrenDao = (daoId: number) => {
    setChildrenDaos(childrenDaos.filter((d) => d.id !== daoId));
  };

  const onToggleChange = (enabled: boolean) => {
    if (!enabled) {
      setChildrenDaos([]);
      setSelectedDao(null);
    }
    setFormInput((prev) => ({ ...prev, isCoalitionDao: enabled }));
  };

  const onFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      try {
        if (event.target.files) {
          const files = event.target.files;
          const imageFile = Array.from(files).filter((file) =>
            file.type.startsWith("image")
          )[0];
          if (event.target.name === "DaoImageInput") {
            setDaoImage({
              image: {
                file: imageFile,
                preview: URL.createObjectURL(imageFile),
              },
            });
            setFormInput((prev) => ({
              ...prev,
              daoImage: imageFile.name,
            }));
          } else {
            setTokenImage({
              image: {
                file: imageFile,
                preview: URL.createObjectURL(imageFile),
              },
            });
            setFormInput((prev) => ({
              ...prev,
              tokenImage: imageFile.name,
            }));
          }
        }
      } catch (error) {
        // await dispatch(
        //   openNotification({
        //     title: "Error",
        //     description: "Make sure you select an image file.",
        //   })
        // );
      }
    },
    []
  );

  const handleFormInputInt = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  const handleFormInputString = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createDao = async () => {
    try {
      if (daoImage && tokenImage) {
        await dispatch(
          openPendingTransactionNotification(daoImage.image.preview)
        );

        let root: string | null;
        let childrenDaosAddresses: string[] | null;
        if (childrenDaos.length > 0) {
          childrenDaosAddresses = childrenDaos.map((d) => d.address);
          const merkleTree = generateMerkleTree(childrenDaosAddresses);
          root = generateMerkleRoot(merkleTree);
        }

        const { daoAddress, transactionHash, status, daoCreatorAddress } =
          await deployDao(formInput, getProvider(), root);

        const signedUrlInput = {
          daoName: formInput.name,
          tokenName: formInput.tokenName,
          daoImage: {
            name: daoImage.image.file.name,
            contentType: daoImage.image.file.type,
          },
          tokenImage: {
            name: tokenImage.image.file.name,
            contentType: tokenImage.image.file.type,
          },
        };
        setIsLoading(true);
        // S3
        const {
          data: {
            result: { tokenResult, daoResult },
          },
        } = await axios.post("/api/s3/signed-url", signedUrlInput);
        const daoImagePromise = axios.put(daoResult.url, daoImage.image.file, {
          headers: {
            "Content-type": daoImage.image.file.type,
          },
        });

        const tokenImagePromise = axios.put(
          tokenResult.url,
          tokenImage.image.file,
          {
            headers: {
              "Content-type": tokenImage.image.file.type,
            },
          }
        );

        await Promise.all([daoImagePromise, tokenImagePromise]);

        await axios.post(
          "/api/create-dao",
          {
            ...formInput,
            daoCreatorAddress,
            tokenImage: tokenResult.path,
            daoImage: daoResult.path,
            daoAddress,
            transactionHash,
            merkleTreeLeaves: childrenDaosAddresses,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = { status, transactionHash };

        await dispatch(
          openTransactionCompleteNotification(result, daoImage.image.preview)
        );
        router.push("/explore");
      }
    } catch (error) {
      await dispatch(openTransactionFailedNotification(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="explore-bg bg-cover">
      <FixedContainer className="flex flex-wrap-reverse justify-center gap-5 py-20">
        <div className="flex flex-col gap-5 text-white">
          <h1 className="text-5xl font-source font-bold">Create New Dao</h1>
          <FileInput
            name="DaoImageInput"
            onFileChange={onFileChange}
            contentFile={daoImage}
            className="flex items-center justify-center border-4 rounded-md border-white w-[350px] h-[255px] p-5"
          />
          <Input
            name="name"
            value={formInput.name}
            required
            label="Name"
            onChange={handleFormInputString}
            placeholder="DAO name"
          />
          <TextArea
            name="description"
            value={formInput.description}
            required
            label="Description"
            onChange={handleFormInputString}
            placeholder="DAO description"
          />

          <h2 className="text-3xl font-source font-bold">Token</h2>
          <FileInput
            name="TokenImageInput"
            onFileChange={onFileChange}
            contentFile={tokenImage}
            className="flex items-center justify-center border-4 rounded-full border-white w-[100px] h-[100px] p-5"
            size={35}
          />
          <div className="flex gap-7">
            <Input
              name="tokenName"
              value={formInput.tokenName}
              required
              label="Name"
              onChange={handleFormInputString}
              placeholder="Token name"
            />
            <Input
              name="tokenSymbol"
              value={formInput.tokenSymbol}
              required
              label="Symbol"
              onChange={handleFormInputString}
              placeholder="Token symbol"
            />
            <Input
              name="mintAmount"
              value={formInput.mintAmount}
              required
              type="number"
              label="Mint Amount"
              onChange={handleFormInputInt}
              placeholder="Mint amount"
              step={1}
              min={0}
            />
          </div>
          <h2 className="text-3xl font-source font-bold">Governance</h2>
          <div className="flex gap-7">
            <Input
              name="minConsensusPeriod"
              value={formInput.minConsensusPeriod}
              required
              type="number"
              label="Consensus Period"
              onChange={handleFormInputInt}
              placeholder="Days"
              step={1}
              min={0}
            />
            <Input
              name="minVotingPeriod"
              value={formInput.minVotingPeriod}
              required
              type="number"
              label="Voting Period"
              onChange={handleFormInputInt}
              placeholder="Days"
              step={1}
              min={0}
            />
            <Input
              name="minQuorum"
              value={formInput.minQuorum}
              required
              type="number"
              label="Quorum"
              onChange={handleFormInputInt}
              placeholder="Basis Points"
              step={1}
              min={0}
            />
          </div>
          <h2 className="text-3xl font-source font-bold">Coalition DAO</h2>
          <div className="flex gap-10 justify-items-center h-14">
            <Toggle onChange={(enabled) => onToggleChange(enabled)} />
            {formInput.isCoalitionDao && (
              <Select
                name="childrenDaos"
                items={daos.map(({ id, name }) => {
                  return { name, code: id.toString() };
                })}
                onChange={(e) => {
                  setSelectedDao(e.target.value);
                }}
                placeholder="Select a DAO"
                required
                className=""
              />
            )}{" "}
            {selectedDao && (
              <button
                onClick={addChildrenDao}
                className="flex gap-4 items-center bg-black border border-white disabled:opacity-50 enabled:hover:border-green p-4"
              >
                <MdAdd size={30} />
                Add
              </button>
            )}
          </div>
          {childrenDaos.length > 0 && (
            <div className="flex gap-10 justify-items-center h-14">
              {childrenDaos.map((dao) => (
                <div key={dao.id}>
                  <button className="flex gap-4 items-center bg-black border border-white disabled:opacity-50 enabled:hover:border-green p-4">
                    {dao.name}
                    <MdClose
                      onClick={() => removeChildrenDao(dao.id)}
                      size={30}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={createDao}
            disabled={!daoImage || !tokenImage || isLoading}
            className="font-bold mt-4 bg-black border border-white disabled:opacity-50 enabled:hover:border-green p-4 rounded-md"
          >
            Create DAO
          </button>
        </div>
      </FixedContainer>
    </div>
  );
};

export const getServerSideProps = async () => {
  const daos = await findAllDaos();

  return {
    props: {
      daos: daos,
    },
  };
};

export default CreateDao;
