"use client";

import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/input";
import {useCallback, useEffect, useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import TextArea from "@/app/components/inputs/TextArea";
import CustomCheckbox from "@/app/components/inputs/CustomCheckbox";
import {categories} from "@/utils/categories";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import {colors} from "@/utils/color";
import SelectColor from "@/app/components/inputs/SelectColor";
import Button from "@/app/components/Button";
import toast from "react-hot-toast";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "@firebase/storage";
import firebaseApp from "@/libs/firebase";
import axios from "axios";
import {useRouter} from "next/navigation";

export type ImageType = {
  color: string;
  colorCode: string;
  image: File | null;
}

export type UploadedImageType = {
  color: string;
  colorCode: string;
  image: File | null;
}

const AddProductForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [images, setImages] = useState<ImageType[] | null>();
  const [isProductCreated, setIsProductCreated] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, reset, formState: {errors}, setValue } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      brand: '',
      category: '',
      inStock: false,
      images: [],
    }
  });

  useEffect(() => {
    setCustomValue('images', images)
  }, [images]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
  }, [isProductCreated]);

  const category = watch('category');

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    let uploadedImages: UploadedImageType[] = [];

    if (!data.category) {
      setIsLoading(false);
      return toast.error("Category is not selected");
    }

    if (!data.images || data.images.length == 0) {
      setIsLoading(false);
      return toast.error("No selected image");
    }

    const handleImageUploads = async () => {
      toast("Creating product, please wait...");
      try {
        for (const item of data.images) {
          if (item.image) {
            const fileName = new Date().getTime() + '-' + item.image.name;
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item.image);

            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log('Upload is ' + progress + '% done');
                  switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused');
                      break;
                    case 'running':
                      console.log('Upload is running');
                      break;
                  }
                },
                (error) => {
                  console.log("Error uploading image", error);
                  reject(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    uploadedImages.push({
                      ...item,
                      image: downloadURL,
                    })
                    resolve();
                  })
                    .catch((error) => {
                      console.log("Error getting the download URL", error);
                      reject(error);
                  });
                }
              )
            });
          }
        }
      }catch (error){
        setIsLoading(false);
        return toast.error("Error handling image uploads");
      }
    };

    await handleImageUploads();

    const productData = { ...data, images: uploadedImages };
    axios.post('/api/product', productData)
      .then(() => {
        toast.success("Product created");
        setIsProductCreated(true);
        router.refresh();
      })
      .catch((error) => {
        toast.error("Something went wrong when saving product to database")
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
  }

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) return [value];

      return [...prev, value];
    })
  }, []);

  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) return prev.filter((item) => item.color !== value.color);
    })
  }, []);

  return (
    <>
      <Heading title="Add a Product" center />
      <Input
        id="name"
        label="Name"
        disable={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="price"
        label="Price"
        disable={isLoading}
        register={register}
        errors={errors}
        type="number"
        required
      />
      <Input
        id="brand"
        label="Brand"
        disable={isLoading}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <CustomCheckbox
        id="inStock"
        label="This Product is in stock"
        register={register}
      />
      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Select a Category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h[50vh] overflow-y-auto">
          {categories.map(item => {
            if (item.label === 'All') return null;

            return (
              <div key={item.label} className="col-span">
                <CategoryInput
                  label={item.label}
                  icon={item.icon}
                  onClick={(category) => setCustomValue('category', category)}
                  selected={category === item.label}
                />
              </div>
            )
          })}
        </div>
        <div className="w-full flex flex-col flex-wrap gap-4">
          <div>
            <div className="font-bold">
              Select the available product colors and upload their images
            </div>
            <div className="text-sm">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard dummy text ever since the 1500s
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {colors.map((item, index) => {
              return (
                <SelectColor
                  key={index}
                  item={item}
                  addImageToState={addImageToState}
                  removeImageToState={removeImageFromState}
                  isProductCreated={isProductCreated}
                />
              )
            })}
          </div>
        </div>
      </div>

      <Button
        label={isLoading ? "Loading" : "Add Product"}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
}

export default AddProductForm;