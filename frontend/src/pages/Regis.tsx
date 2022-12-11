import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonItem,
  IonInput,
  IonButton,
  useIonToast,
  IonAvatar,
  IonSelect,
  IonSelectOption,
  useIonLoading,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import API from "../hooks/useAPI";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Filesystem } from "@capacitor/filesystem";
const Register: React.FC = () => {
  const [present, dismiss] = useIonLoading();
  const history = useHistory();
  const [IonToast] = useIonToast();
  const [img, setImg] = useState<any>();
  const [payload, setPayload] = useState({
    username: "",
    email: "",
    password: "",
    image: "https://ionicframework.com/docs/img/demos/avatar.svg",
  });

  const takePhoto = async () => {
    const access = await Filesystem.checkPermissions();
    if (access.publicStorage === "denied") {
      await Filesystem.requestPermissions();
    } else {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        quality: 100,
      });

      setImg(photo.dataUrl);
      setPayload({ ...payload, ["image"]: photo.dataUrl! });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("It's me")) {
      history.push("/member");
    }
  }, []);

  const showToast = (message: any) => {
    IonToast({
      message: message,
      duration: 1500,
      position: "bottom",
      mode: "ios",
    });
  };

  const handleChange = (event: any) => {
    setPayload({ ...payload, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, username, email } = payload;
    if (username.length < 3) {
      showToast("Username should be greater than 3 characters.");
      return false;
    } else if (password.length < 8) {
      showToast("Password should be equal or greater than 8 characters.");
      return false;
    } else if (email === "") {
      showToast("Email is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password, image } = payload;
      present({
        message: "Registering...",
        spinner: "crescent",
      });
      const { data } = await API.post(`/auth/register`, {
        username,
        email,
        password,
        image,
      });
      dismiss();
      if (data.status === false) {
        showToast(data.msg);
      }
      if (data.status === true) {
        localStorage.setItem("It's me", JSON.stringify(data.user));
        history.push("/member");
      }
    } else {
      showToast("Validation failed.");
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            height: "100%",
          }}
        >
          <IonCard mode="ios">
            <IonCardHeader style={{ textAlign: "center" }}>
              <IonCardTitle>Basic Chat App</IonCardTitle>
              <IonCardSubtitle>Register to communicate</IonCardSubtitle>
            </IonCardHeader>
            <IonAvatar
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                width: "5rem",
                height: "5rem",
              }}
            >
              <img
                alt="Silhouette of a person's head"
                src={
                  img
                    ? img
                    : "https://ionicframework.com/docs/img/demos/avatar.svg"
                }
              />
            </IonAvatar>
            <form action="" onSubmit={(event) => handleSubmit(event)}>
              <IonCard>
                <IonItem lines="none">
                  <IonInput
                    placeholder="username"
                    name="username"
                    type="text"
                    onIonChange={(e) => handleChange(e)}
                  ></IonInput>
                </IonItem>
              </IonCard>
              <IonCard>
                <IonItem lines="none">
                  <IonInput
                    placeholder="email"
                    name="email"
                    type="email"
                    onIonChange={(e) => handleChange(e)}
                  ></IonInput>
                </IonItem>
              </IonCard>
              <IonCard>
                <IonItem lines="none">
                  <IonInput
                    placeholder="password"
                    name="password"
                    type="password"
                    onIonChange={(e) => handleChange(e)}
                  ></IonInput>
                </IonItem>
              </IonCard>
              <IonCard style={{ boxShadow: "none" }}>
                <IonButton
                  expand="block"
                  color="success"
                  type="button"
                  onClick={takePhoto}
                >
                  Select Image Account
                </IonButton>
              </IonCard>
              <IonCard style={{ boxShadow: "none", marginTop: "-1rem" }}>
                <IonButton expand="block" type="submit">
                  Sign up
                </IonButton>
              </IonCard>
            </form>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
