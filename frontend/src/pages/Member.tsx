import {
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonContent,
  IonPage,
  IonAvatar,
  IonNote,
  IonFab,
  IonFabButton,
  IonIcon,
  useIonLoading,
  IonProgressBar,
  IonRefresherContent,
  IonRefresher,
  RefresherEventDetail,
  IonBadge,
  IonFooter,
} from "@ionic/react";
import { arrowDown, bonfire, logoAppleAr, logOutOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import API from "../hooks/useAPI";
import dayjs from "dayjs";
import { useBack } from "../hooks/store";

const ChatMember: React.FC = () => {
  const [present, dismiss] = useIonLoading();
  const isBack = useBack((state: any) => state.isBack);
  const setIsBack = useBack((state: any) => state.setIsBack);
  const history = useHistory();
  const [load, setLoad] = useState(true);
  const [contact, setContact] = useState<any>([]);
  const [currentUser, setCurrentUser] = useState<any>();

  const mounted = async () => {
    if (!localStorage.getItem("It's me")) {
      history.push("/");
    } else {
      setCurrentUser(await JSON.parse(localStorage.getItem("It's me")!));
    }
  };

  const mounted_contact = async () => {
    setContact([]);
    const data = await JSON.parse(localStorage.getItem("It's me")!);
    if (currentUser) {
      API.get(`/auth/allusers/${currentUser._id}`).then((response) => {
        response.data.map((item: any) => {
          API.post(`/messages/getmsg`, {
            from: data._id,
            to: item._id,
          }).then((response) => {
            try {
              const last = response.data.reduce((a: any, b: any) =>
                a.date > b.date ? a : b
              );
              const date = dayjs(last.date)
                .format("DD/MM/YYYY HH:mm")
                .split(" ");
              var count = 0;
              if (!last.fromSelf) {
                count = response.data.filter(
                  (x: any) => x.fromSelf === false && x.isRead === false
                ).length;
              }
              setContact((prev: any) => [
                ...prev,
                {
                  ...item,
                  ...{
                    message: last.message,
                    unReadCount: count,
                    date: date[0],
                    time: date[1],
                  },
                },
              ]);
            } catch (error) {
              setContact((prev: any) => [
                ...prev,
                {
                  ...item,
                  ...{ message: "No message", date: "New", time: "" },
                },
              ]);
            }
          });
        });
        setLoad(false);
      });
    }
  };

  const refresh_contact = async (event: CustomEvent<RefresherEventDetail>) => {
    setContact([]);
    const data = await JSON.parse(localStorage.getItem("It's me")!);
    if (currentUser) {
      API.get(`/auth/allusers/${currentUser._id}`).then((response) => {
        response.data.map((item: any) => {
          API.post(`/messages/getmsg`, {
            from: data._id,
            to: item._id,
          }).then((response) => {
            try {
              const last = response.data.reduce((a: any, b: any) =>
                a.date > b.date ? a : b
              );
              const date = dayjs(last.date)
                .format("DD/MM/YYYY HH:mm")
                .split(" ");
              var count = 0;
              if (!last.fromSelf) {
                count = response.data.filter(
                  (x: any) => x.fromSelf === false && x.isRead === false
                ).length;
              }
              setContact((prev: any) => [
                ...prev,
                {
                  ...item,
                  ...{
                    message: last.message,
                    unReadCount: count,
                    date: date[0],
                    time: date[1],
                  },
                },
              ]);
            } catch (error) {
              setContact((prev: any) => [
                ...prev,
                {
                  ...item,
                  ...{ message: "No message", date: "New", time: "" },
                },
              ]);
            }
          });
        });
        event.detail.complete();
      });
    }
  };

  const logout = async () => {
    const id = await JSON.parse(localStorage.getItem("It's me")!)._id;
    present({
      message: "Log out...",
      spinner: "circles",
    });
    const data = await API.get(`/auth/logout/${id}`);
    dismiss();
    if (data.status === 200) {
      localStorage.clear();
      history.push("/");
    }
  };

  useEffect(() => {
    mounted();
  }, []);

  useEffect(() => {
    mounted_contact();
  }, [currentUser]);

  useEffect(() => {
    if (isBack) {
      mounted_contact();
      setIsBack(false);
    }
  });

  const selectContact = (contact: any) => {
    delete contact.message;
    delete contact.image;
    delete contact.date;
    delete contact.time;
    history.push(`/chat_room/${JSON.stringify(contact)}`);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonFab slot="fixed" vertical="top" horizontal="end">
          <IonFabButton size="small" color="danger" onClick={logout}>
            <IonIcon icon={logOutOutline} size="small"></IonIcon>
          </IonFabButton>
        </IonFab>
        <IonList>
          <IonListHeader>
            <IonLabel>
              <h1>
                <b>Chat Member</b>
              </h1>
              <p>Log in as {currentUser ? currentUser.username : "Loading"}</p>
            </IonLabel>
          </IonListHeader>
          {load ? (
            <IonProgressBar type="indeterminate"></IonProgressBar>
          ) : (
            <></>
          )}
          <IonRefresher slot="fixed" onIonRefresh={refresh_contact}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          {contact.map((item: any, index: any) => (
            <IonItem
              button
              lines="full"
              key={index}
              detail={false}
              onClick={(e) => selectContact(item)}
            >
              <IonAvatar slot="start">
                <img src={item.image} />
              </IonAvatar>
              <IonLabel>
                <h2>
                  {item.username}{" "}
                  {item.unReadCount > 0 && (
                    <IonBadge color="danger">{item.unReadCount}</IonBadge>
                  )}
                </h2>
                <p style={{ color: item.unReadCount ? "red" : "gray" }}>
                  {item.message}
                </p>
              </IonLabel>
              <IonNote
                slot="end"
                style={{ textAlign: "center", fontSize: "0.9rem" }}
              >
                {item.date}
                <br />
                {item.time}
              </IonNote>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ChatMember;
