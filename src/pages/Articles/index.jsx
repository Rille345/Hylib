import moment from 'moment';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Link, useHistory, useParams } from "react-router-dom";
import Bottom from "../../components/Bottom";
import Footer from "../../components/Footer";
import Head from "../../components/Head";
import Header from "../../components/Header";
import Requests from '../../services/Requests';
import { scrollToTop } from "../../utils/utils";

import StoreContext from "../../store/Context";

const Articles = (props) => {
    const { config, user } = React.useContext(StoreContext);
    const history = useHistory();

    const { id } = useParams();

    const [isLoadingCurrentNews, setLoadingCurrentNews] = React.useState(true);
    const [isLoadingGetComments, setLoadingGetComments] = React.useState(false);
    const [isLoadingCommentWrite, setLoadingCommentWrite] = React.useState(false);

    const [isLoadingLikes, setLoadingLikes] = React.useState(false);

    const [currentNews, setCurrentNews] = React.useState(null);
    const [newsIndex, setNewsIndex] = React.useState([]);
    const [like, setLikes] = React.useState([]);
    const [comments, setComments] = React.useState([]);
    const [value, setValue] = React.useState("");
    const [alert, setAlert] = React.useState(null);

    const sendAlert = (severity, message) => {
        setAlert(
            severity === null || message === null ? (
                null
            ) : (
                <div class="general-warn-time-2">
                    <label>{ReactHtmlParser(message)}</label>
                </div>
            )
        );
    }

    const getNewsIndex = () => {
        setTimeout(() => {
            Requests.articles
                .getNewsIndex()
                .then(response => {
                    setNewsIndex(response.data);
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                })
        }, config.dev.timeout);
    }

    const getNews = (id) => {
        scrollToTop();

        let validId = id == parseInt(id);
        if (!validId) {
            history.push('/');
        }

        setLoadingCurrentNews(true)
        setTimeout(() => {
            Requests.articles
                .getNews(validId, id)
                .then(response => {
                    if (response.data.status_code === 400 || response.data.status_code === 404) {
                        setCurrentNews(null);
                        history.push('/');
                    } else {
                        setCurrentNews(response.data);
                    }
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                    setLoadingCurrentNews(false)
                })
        }, config.dev.timeout);
    }

    const getLikes = (id) => {
        let validId = id == parseInt(id);
        if (!validId) {
            history.push('/');
        }

        setLoadingLikes(true);

        setTimeout(() => {
            Requests.articles
                .getLikes(validId, id)
                .then(response => {
                    setLikes(response.data);
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                    setLoadingLikes(false);
                })

        }, config.dev.timeout);
    }

    const getComments = (id) => {
        let validId = id == parseInt(id);
        if (!validId) {
            history.push('/');
        }

        setLoadingGetComments(true);

        setTimeout(() => {
            Requests.articles
                .getComments(validId, id)
                .then(response => {
                    setComments(response.data);
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                    setLoadingGetComments(false);
                })

        }, config.dev.timeout);
    }

    const sendLike = (e) => {
        if (e !== undefined) e.preventDefault();

        setLoadingLikes(true);
        setTimeout(() => {
            Requests.articles
                .sendLike(id)
                .then(response => {
                    if (response.data.status_code || response.data.status_code === 400 || response.data.status_code === 404) {
                        sendAlert('error', response.data.message)
                    } else {
                        getLikes(id);
                    }
                }).finally(() => {
                    setLoadingLikes(false);
                })
        }, 500)
    }

    const sendComment = (e) => {
        if (e !== undefined) e.preventDefault();

        setLoadingCommentWrite(true);
        setTimeout(() => {
            Requests.articles
                .sendComment(id, value)
                .then(response => {
                    if (response.data.status_code || response.data.status_code === 400 || response.data.status_code === 404) {
                        sendAlert('error', response.data.message)
                    } else {
                        setValue("");
                        setAlert(null);
                        getComments(id);
                    }
                }).finally(() => {
                    setLoadingCommentWrite(false);
                })
        }, 500)
    }

    React.useEffect(() => {
        getNews(id);
        getComments(id);
        getLikes(id);
    }, [id]);

    React.useEffect(() => {
        scrollToTop();
        getNewsIndex();
    }, [])

    return (
        <>
            <Head />
            <Header visited="articles" />
            <div className="webcenter flex">
                <div className="col-12 mr-right-3 mr-auto-left">
                    <div className="general-box-3 height-auto overflow-hidden pd-none">
                        <div className="general-box-header flex">
                            <div className="general-box-header-icon">
                                <icon name="plus-magic" className="flex mr-auto"></icon>
                            </div>
                            <label className="color-4 flex-column">
                                <h4 className="bold">Outras noticias</h4>
                                <h6>Continue lendo outras noticias que preparamos para você.</h6>
                            </label>
                        </div>
                        <div className="general-box-content flex-column">
                            {
                                newsIndex.length > 0 &&
                                newsIndex.map((item, index) => {
                                    return (
                                        <>
                                            <React.Fragment key={index}>
                                                <div className="others-articles-separator">{item.section}</div>
                                                <div className="others-articles-boxes">
                                                    {
                                                        item.news.map((news) => {

                                                            return (

                                                                <Link to={`/news/${news.id}`} place="<?= $result_others_articles['title'] . ' - ' . HOTELNAME; ?>" className="other-aticle-box no-link" style={{ backgroundImage: `url(${news?.image})`, backgroundColor: 'rgb(114 73 173)' }} key={news.id}>
                                                                    <div className={`other-article-indicator pointer-none ${currentNews?.id === news?.id ? 'visited' : ''}`}></div>
                                                                    <label className="width-content mr-auto-top-bottom text-nowrap color-1 pointer-none">
                                                                        <h5 className="bold text-nowrap">{news?.rascunho === true ? <span style={{ color: "red" }}>{news?.title}</span> : news.title}</h5>
                                                                        <h6 className="text-nowrap fs-11">{news?.shortstory}</h6>
                                                                    </label>
                                                                </Link>
                                                            );

                                                        })
                                                    }

                                                </div>
                                            </React.Fragment>
                                        </>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="col-11 flex-column mr-auto-right">
                    <div className="news-article general-box pd-none overflow-hidden">

                        <div className="news-article-head flex" style={{ background: `linear-gradient(to right, ${!isLoadingCurrentNews && currentNews !== null ? currentNews?.hex : '#B1D4EB'} 70%, #00000000), url(${!isLoadingCurrentNews && currentNews !== null ? currentNews?.image : ''}) right center no-repeat` }}>
                            <label className="color-1 flex-column mr-auto-top-bottom">
                                {
                                    isLoadingCurrentNews ? (
                                        <>
                                            <h4 className="bold">...</h4>
                                            <h5>...................</h5>
                                        </>
                                    ) : (
                                        <>
                                            <h4 className="bold">{currentNews !== null ? currentNews?.title : ''}</h4>
                                            <h5>{currentNews !== null ? currentNews?.shortstory : ''} </h5>
                                        </>
                                    )

                                }


                            </label>
                        </div>
                        <div className="news-article-body">{currentNews !== null ? ReactHtmlParser(currentNews?.longstory) : ''}</div>
                        <div className="article-body-author flex">
                            <div className="article-body-author-imager">
                                {
                                    isLoadingCurrentNews ? (
                                        <img src={`${config.hotel.avatarImage}?figure=ghost&action=wav&direction=2&head_direction=3&gesture=sml&size=n&img_format=png&frame=0&headonly=0`} />
                                    ) : (
                                        currentNews !== null ? <img src={`${config.hotel.avatarImage}?figure=${currentNews?.figure}&action=wav&direction=2&head_direction=3&gesture=sml&size=n&img_format=png&frame=0&headonly=0`} />
                                            : ''
                                    )
                                }

                            </div>
                            <label className="color-5 flex- mr-auto-top-bottom flex-column">
                                {
                                    isLoadingCurrentNews ? (
                                        <>
                                            <h5>Publicada por: ...</h5>
                                            <h6 className="mr-top-1">Em <b>...</b></h6>
                                        </>
                                    ) : (
                                        <>
                                            <h5>Publicada por: <Link to={`/profile/${currentNews?.username}`} className="no-link bold">{currentNews?.username}</Link></h5>
                                            <h6 className="mr-top-1">Em <b>{moment.unix(currentNews?.date).format("DD/MM/YYYY HH:mm:ss")}</b></h6>
                                        </>

                                    )
                                }

                            </label>
                        </div>
                        <div className="news-article-footer flex pd-2">
                            <div className="news-article-like flex-column mr-auto-left mr-right-1">
                                {
                                    isLoadingLikes && user !== null ? (
                                        <>
                                            <button className="reset-button flex mr-auto" disabled={true}>
                                                <icon name="heart-big-noborder"></icon>
                                            </button>
                                            <h5 className="mr-auto-top mr-auto-left-right text-center">... like</h5>
                                        </>
                                    ) : (
                                        !isLoadingLikes && user !== null ? (
                                            <>
                                                <button className="reset-button flex mr-auto" disabled={isLoadingLikes} onClick={sendLike}>
                                                    <icon name={like.like > 0 ? "heart-big" : "heart-big-noborder"}></icon>
                                                </button>
                                                <h5 className="mr-auto-top mr-auto-left-right text-center">{like.like <= 1 ? like.like + " like" : like.like + " likes"}</h5>
                                            </>
                                        ) : (
                                            user === null ? (
                                                <>
                                                    <div className="flex mr-auto">
                                                        <icon name="heart-big-noborder"></icon>
                                                    </div>
                                                    <h5 className="mr-auto-top mr-auto-left-right text-center">{like.like <= 1 ? like.like + " like" : like.like + " likes"}</h5>
                                                </>
                                            ) : (
                                                <></>
                                            )
                                        )
                                    )
                                }


                            </div>
                        </div>
                    </div>
                    {
                        !isLoadingCurrentNews && currentNews?.commentsEnabled === true && user !== null ? (

                            <>
                                <form method="POST" onSubmit={sendComment}>
                                    <div className="article-comments flex-column mr-top-1">
                                        <div className="article-send-comment general-box flex-column pd-none overflow-hidden">
                                            <div className="flex pd-1">
                                                <div className="article-send-comment-habbo">
                                                    <img src={`${config.hotel.avatarImage}?figure=${user?.figure}&action=wlk,crr=667direction=2&head_direction=3&gesture=sml&size=n&img_format=png&frame=0&headonly=0`} />
                                                </div>
                                                <div className="general-contenteditable flex">
                                                    <textarea contenteditable="true" placeholder="Digite aqui seu comentário..." value={value} onChange={(e) => setValue(e.target.value)}></textarea>
                                                </div>
                                                <div className="article-send-comment-button">
                                                    <button type="submit" disabled={isLoadingCommentWrite}>Comentar</button>
                                                </div>
                                            </div>
                                            <div class="send-comment-warn">
                                                {alert}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </>

                        ) : (
                            !isLoadingCurrentNews && user !== null && currentNews?.commentsEnabled === false ? (
                                <>
                                    <div className="article-comments flex-column mr-top-1">
                                        <div className="general-box article-comments-disabled flex height-auto mr-top-1">
                                            <label className="color-1">
                                                <h3 className="bold">Melhor comentar sobre a vida dos outros</h3>
                                                <h5>Pois os comentários para essa noticia, foram desativados pelo autor.</h5>
                                            </label>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                </>
                            )

                        )
                    }

                    {
                        isLoadingGetComments && currentNews?.commentsEnabled === true && comments.length > 0 ? (
                            <>
                                <div className="article-comments-area flex-column">
                                    <div className="article-comment-box flex general-box mr-top-1">
                                        <div className="article-comment-author-habbo mr-right-2">
                                            <img width="33px" height="56px" src={`${config.hotel.avatarImage}?figure=ghost&aaction=wlk,crr=667direction=2&head_direction=3&gesture=sml&size=n&img_format=png&frame=0&headonly=0`} className="mr-auto-left-right" />
                                        </div>
                                        <label className="color-4 mr-auto-top-bottom">
                                            <h5>...</h5>
                                            <h6 className="fs-10 mr-top-1">Por ...</h6>
                                        </label>
                                    </div>
                                </div>
                            </>
                        ) : (
                            !isLoadingGetComments && currentNews?.commentsEnabled === true && comments.length > 0 ? (
                                <>
                                    <div className="article-comments-area flex-column">
                                        {
                                            comments.map((player, index) => {
                                                return (
                                                    <>
                                                        <div className="article-comment-box flex general-box mr-top-1" key={index}>
                                                            <div className="article-comment-author-habbo mr-right-2">
                                                                <img width="33px" height="56px" src={`${config.hotel.avatarImage}?figure=${player.figure}&aaction=wlk,crr=667direction=2&head_direction=3&gesture=sml&size=n&img_format=png&frame=0&headonly=0`} className="mr-auto-left-right" />
                                                            </div>
                                                            <label className="color-4 mr-auto-top-bottom">
                                                                <h5>{player.value}</h5>
                                                                <h6 className="fs-10 mr-top-1">Por <Link to={`/profile/${player.username}`} className="no-link bold">{player.username}</Link> às <b>{moment.unix(player?.timestamp).format("HH:mm:ss DD/MM/YYYY ")}</b></h6>
                                                            </label>
                                                        </div>
                                                    </>
                                                )
                                            })
                                        }

                                    </div>
                                </>
                            ) : (
                                <></>
                            )
                        )
                    }
                    <Footer />
                </div>
            </div>
            <Bottom />
        </>

    )
}

export default Articles;