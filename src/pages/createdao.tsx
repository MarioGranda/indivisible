import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import FixedContainer from "@/client/layouts/FixedContainer";
import Input from "@/client/components/Input";
import TextArea from "@/client/components/TextArea";
import { ContentFileType } from "@/shared/models";
import FileInput from "@/client/components/FileInput";
import axios from "axios";
import { useDispatch } from "react-redux";
import getProvider from "@/shared/utils/getProvider";
import { deployDao } from "@/client/utils/createDao";
import { CreateDaoInput } from "@/shared/validators/createDao";
import {
  openPendingTransactionNotification,
  openTransactionCompleteNotification,
} from "@/client/redux/actions/notification";
import { useNotification } from "@/client/redux/selectors";
import Notification from "@/client/components/Notification";


export const CreateItem: FC = () => {
  const [daoImage, setDaoImage] = useState<ContentFileType | null>(null);
  const [tokenImage, setTokenImage] = useState<ContentFileType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const notification = useNotification();

  useEffect(() => {
    if (daoImage?.image?.preview) {
      dispatch(openPendingTransactionNotification(daoImage.image.preview));
    }
  }, [daoImage]);

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
  });

  const validationResult = CreateDaoInput.safeParse(formInput);

  const onFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      try {
        if (event.target.files) {
          const files = event.target.files;
          const imageFile = Array.from(files).filter((file) =>
            file.type.startsWith("image")
          )[0];
          console.log(event);
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
        console.log(error);
        // await dispatch(
        //   openNotification({
        //     title: "Error",
        //     description: "Make sure you select an image and audio file.",
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
    console.log(formInput);
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
      // await dispatch(
      //   openNotification({
      //     title: "Uploading NFT media",
      //     description: "Uploading image and audio to S3",
      //     status: "PENDING",
      //   })
      // );
      console.log(formInput);
      if (daoImage && tokenImage) {
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

        // await dispatch(
        //   openNotification({
        //     title: "Creating FullTrack",
        //     description: getTransactionMessage("PENDING"),
        //     status: "PENDING",
        //   })
        // );
        await dispatch(
          openPendingTransactionNotification(daoImage.image.preview)
        );

        const { daoAddress, transactionHash, status, daoCreatorAddress } =
          await deployDao(formInput, getProvider());

        await axios.post(
          "/api/create-dao",
          {
            ...formInput,
            daoCreatorAddress,
            tokenImage: tokenResult.path,
            daoImage: daoResult.path,
            daoAddress,
            transactionHash,
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
        //if (status === 1) {
        //   await dispatch(
        //     openNotification({
        //       title: "FullTrack created succesfully",
        //       description: getTransactionMessage("SUCCESS"),
        //       status: "SUCCESS",
        //       transactionHash: transactionHash,
        //       closeOnRouteChange: false,
        //     })
        //   );
        // } else {
        //   await dispatch(
        //     openNotification({
        //       title: "FullTrack creation failed",
        //       description: getTransactionMessage("FAILED"),
        //       status: "FAILED",
        //       closeOnRouteChange: true,
        //     })
        //   );
        // }
        // router.push("/");
      }
    } catch (error) {
      // await dispatch(
      //   openNotification({
      //     title: "Error",
      //     description: getErrorMessage(error),
      //     status: "FAILED",
      //   })
      // );
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FixedContainer className="flex flex-wrap-reverse justify-center gap-5 my-20">
      <div className="flex flex-col gap-5 text-white">
        <h1 className="text-5xl font-source font-bold">Create New Dao</h1>
        <FileInput
          name="DaoImageInput"
          onFileChange={onFileChange}
          contentFile={daoImage}
          className="flex items-center justify-center border-4 border-white w-[350px] h-[255px] p-5"
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
        <h2 className="text-3xl font-source font-bold">Minimum standards</h2>
        <div className="flex gap-7">
          <Input
            name="minConsensusPeriod"
            value={formInput.minConsensusPeriod}
            required
            type="number"
            label="Consensus Period"
            onChange={handleFormInputInt}
            placeholder="Min consensus period"
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
            placeholder="Min voting period"
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
            placeholder="Min quorum"
            step={1}
            min={0}
          />
        </div>
        <button
          onClick={createDao}
          disabled={!daoImage || !tokenImage || isLoading}
          className="font-bold mt-4 bg-black border border-white disabled:opacity-50 enabled:hover:border-green enabled:focus:border-green p-4 shadow-lg"
        >
          Create DAO
        </button>
      </div>
      {notification && <Notification></Notification>}
    </FixedContainer>
  );
};

export default CreateItem;
