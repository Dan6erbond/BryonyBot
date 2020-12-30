import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import { BonusActivity } from "../../models/update";

interface UpdateActivityElementProps {
  activity: BonusActivity;
}

function UpdateActivityElement({ activity }: UpdateActivityElementProps) {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <React.Fragment>
      <div onClick={handleShow}>
        {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
        <span>
          {activity.moneyAmount === activity.rpAmount
            ? activity.moneyAmount + "x GTA$ and RP"
            : activity.moneyAmount +
              "x GTA$ and " +
              activity.rpAmount +
              "x RP"}{" "}
          on {activity.name + " "}
        </span>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{activity.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            {activity.moneyAmount !== 1 && (
              <span>
                <b>Pay: </b>
                {activity.moneyAmount}x GTA$
              </span>
            )}
            {activity.pay && (
              <span>
                <br />
                <b>Average: </b>GTA${" "}
                {(activity.moneyAmount * activity.pay).toLocaleString()}
              </span>
            )}
            {activity.minPay && (
              <span>
                <br />
                <b>Min Pay: </b>GTA${" "}
                {(activity.moneyAmount * activity.minPay).toLocaleString()}
              </span>
            )}
            {activity.maxPay && (
              <span>
                <br />
                <b>Max Pay: </b>GTA${" "}
                {(activity.moneyAmount * activity.maxPay).toLocaleString()}
              </span>
            )}
            {activity.rpAmount !== 1 && (
              <span>
                <br />
                <br />
                <b>RP: </b>
                {activity.rpAmount}x RP
              </span>
            )}
          </p>
          {activity.url && (
            <Button variant="link" href={activity.url} target="_blank">
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </Button>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default UpdateActivityElement;
