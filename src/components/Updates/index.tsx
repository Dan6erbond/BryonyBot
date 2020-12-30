// eslint-disable react-hooks/exhaustive-deps
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, Container, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../../Firebase";
import Update, {
  BonusActivity,
  SaleItem,
  UpdateItem
} from "../../models/update";
import { RootState } from "../../store";
import { setUpdates } from "../../store/Updates";
import "./index.scss";
import UpdateActivityElement from "./UpdateActivityElement";
import UpdateItemElement from "./UpdateItemElement";

import "./index.scss";
import "../../styles/reel.scss";
import "../../styles/update-table.scss";

interface UpdatesProps {
  firebase?: Firebase;
  updates: Update[];
  setUpdates: typeof setUpdates;
}

const Updates = ({ firebase, updates, setUpdates }: UpdatesProps) => {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!updates.length) {
      setLoading(true);
      firebase!.getUpdates().then((updates) => {
        setUpdates(updates);
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loading) {
    return (
      <div className="updates justify-content-center p-0">
        {/* <div className="reel">
          <span className="reel-item is-active">9/3/2020</span>
          <span className="reel-item">8/27/2020</span>
          <span className="reel-item">8/20/2020</span>
          <span className="reel-item">8/13/2020</span>
        </div> */}
        <div className="background" />
        {updates
          .sort((u1, u2) =>
            u1.date === u2.date ? 0 : u1.date < u2.date ? 1 : -1
          )
          .map((update: Update, index: number) => (
            <div
              className="update"
              key={index}
              data-aos="zoom-in-up"
              data-aos-duration="400"
            >
              <div
                className="update-title"
              >
                  <span
                    className="update-title__topic text-muted"
                  >
                    Weekly Update
                  </span>
                  <span
                    className="update-title__date"
                  >
                    {update.date.toLocaleString('default', { 
                      month: 'long', day: 'numeric', year: 'numeric' 
                    })}
                  </span>
                  <span
                    className="update-title__link"
                  >
                    {update.redditThread && (
                      <Button
                        variant="link"
                        href={
                          "https://reddit.com/r/gtaonline/comments/" +
                          update.redditThread
                        }
                        target="_blank"
                      >
                        <span
                          className="update-title__link--text"
                        >
                          /r/gtaonline
                        </span>
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </Button>
                    )}
                  </span>
              </div>
              <div className="update-table">
                {update.podium && (
                  <div className="update-table__row">
                    <div className="update-table__column">
                      <div className="update-table__cell">
                        Podium Vehicle
                      </div>
                    </div>
                    <div className="update-table__column">
                      <div className="update-table__cell">
                        <UpdateItemElement
                          key={update.podium.item.id}
                          item={update.podium}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {update.new.length !== 0 && (
                  <div className="update-table__row">
                    <div className="update-table__column">
                      <div className="update-table__cell">
                        New Content
                      </div>
                    </div>
                    <div className="update-table__column">
                      {update.new.map((item: UpdateItem) => (
                        <div className="update-table__cell">
                          <UpdateItemElement key={item.item.id} item={item} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {update.bonusActivities.length !== 0 && (
                  <div className="update-table__row">
                    <div className="update-table__column">
                      <div className="update-table__cell">
                        Bonus GTA$ and RP Activities
                      </div>
                    </div>
                    <div className="update-table__column">
                      {update.bonusActivities.map((activity: BonusActivity) => (
                        <div className="update-table__cell">
                          <UpdateActivityElement
                            key={activity.activity.id}
                            activity={activity}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {update.sale.length !== 0 && (
                  <div className="update-table__row">
                    <div className="update-table__column">
                      <div className="update-table__cell">
                        Discounts
                      </div>
                    </div>
                    <div className="update-table__column">
                      {update.sale.map((item: SaleItem) => (
                        <div className="update-table__cell">
                          <UpdateItemElement key={item.item.id} item={item} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {update.twitchPrime.length !== 0 && (
                  <div className="update-table__row">
                    <div className="update-table__column">
                      <div className="update-table__cell">
                        Twitch Prime Bonuses
                      </div>
                    </div>
                    <div className="update-table__column">
                      {update.twitchPrime.map((item: SaleItem) => (
                        <div className="update-table__cell">
                          <UpdateItemElement key={item.item.id} item={item} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {update.targetedSale.length !== 0 && (
                  <div className="update-table__row">
                    <div className="update-table__column">
                      <div className="update-table__cell">
                        Targeted Sales
                      </div>
                    </div>
                    <div className="update-table__column">
                      {update.targetedSale.map((item: SaleItem) => (
                        <div className="update-table__cell">
                          <UpdateItemElement key={item.item.id} item={item} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {update.timeTrial && (
                  <div className="update-table__row">
                    <div className="update-table__column">
                      <div className="update-table__cell">
                      Time Trial
                      </div>
                    </div>
                    <div className="update-table__column">
                      <div className="update-table__cell">
                        <a
                          href={update.timeTrial.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {update.timeTrial.name}, Par Time{" "}
                          {update.timeTrial.parTime}
                          <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                {update.rcTimeTrial && (
                  <div className="update-table__row">
                    <div className="update-table__column">
                      <div className="update-table__cell">
                        RC Bandito Time Trial
                      </div>
                    </div>
                    <div className="update-table__column">
                      <div className="update-table__cell">
                        <a
                          href={update.rcTimeTrial.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {update.rcTimeTrial.name}, Par Time{" "}
                          {update.rcTimeTrial.parTime}
                          <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                {update.premiumRace && (
                  <div className="update-table__row">
                    <div className="update-table__column">
                      <div className="update-table__cell">
                        Premium Race
                      </div>
                    </div>
                    <div className="update-table__column">
                      <div className="update-table__cell">
                        <a
                          href={update.premiumRace.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {update.premiumRace.name}
                          <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    );
  } else {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner
          animation="grow"
          className="p-4"
          variant="warning"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }
};

const mapStateToProps = (state: RootState) => ({
  updates: state.updates.updates,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setUpdates,
    },
    dispatch
  );

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(Updates) as any;
