import { useEffect, useState } from "react";
import {
  Container,
  Stack,
  Button,
  Spinner,
  Alert,
  Col,
  Card,
  Modal,
} from "react-bootstrap";
import { GetMyWatchLaters, DeleteWatch } from "../api/apiWatch";
import { getThumbnail } from "../api";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const WatchLaterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [watchs, setWatchs] = useState([]);
  const [isPending, setIsPending] = useState(false);
  // const [show, setShow] = useState(false);

  const deleteWatch = (id) => {
    setIsPending(true);
    DeleteWatch(id)
      .then((response) => {
        setIsPending(false);
        toast.success(response.message);
        GetMyWatchLaters()
        .then((data) => {
          setWatchs(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
        handleCloseDeleteModal();
      })
      .catch((err) => {
        console.log(err);
        setIsPending(false);
        toast.dark(err.message);
      });
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [watchToDelete, setWatchToDelete] = useState(null);

  const handleShowDeleteModal = (id) => {
    setWatchToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setWatchToDelete(null);
  };


  useEffect(() => {
    setIsLoading(true);
    GetMyWatchLaters()
      .then((data) => {
        setWatchs(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <Container>
      <Stack direction="horizontal" gap={3} className="mb-3">
        <h1 className="h4 fw-bold mb-0 text-nowrap">Watch Later Videos</h1>
        <hr className="border-top border-light opacity-50 w-100" />
      </Stack>
      {isLoading ? (
        <div className="text-center">
          <Spinner
            as="span"
            animation="border"
            variant="primary"
            size="lg"
            role="status"
            aria-hidden="true"
          />
          <h6 className="mt-2 mb-0">Loading...</h6>
        </div>
      ) : watchs?.length > 0 ? (
        <>
          {watchs?.map((watch, index) => {
            return (
              <Col md={12} className="h-100 mb-3" key={index}>
                <Card className="">
                  <Card.Body>
                    <div className="d-flex">
                      <div className="col-md-3">
                        <img
                          src={getThumbnail(watch.content.thumbnail)}
                          alt=""
                          className="img-fluid rounded object-fit-cover bg-light"
                          style={{ aspectRatio: "16 / 9" }}
                        />
                      </div>
                      <div className="col-md-9 d-flex justify-content-between ps-3">
                        <div>
                          <h5 className="card-title text-truncate">
                            {watch.content.title}
                          </h5>
                          <p className="card-text">
                            {watch.content.description}
                          </p>
                        </div>
                        <div>
                          <p>Tanggal ditambahkan : {watch.date_added}</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="danger"
                        onClick={() => handleShowDeleteModal(watch.id)}
                      >
                        <FaTrash className="mx-1 mb-1" />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
          <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Apakah Kmu Yakin ingin menghapus ini dari watch later?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                Batal
              </Button>
              <Button variant="danger" onClick={() => deleteWatch(watchToDelete)}>
                Hapus
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <Alert variant="dark" className="mt-3 text-center">
          Belum ada video di watch later, yuk tambah video baru!
        </Alert>
      )}
    </Container>
  );
};

export default WatchLaterPage;
