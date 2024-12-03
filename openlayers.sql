--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: predefined_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.predefined_location (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    coordinates public.geometry(Point,4326) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.predefined_location OWNER TO postgres;

--
-- Name: predefined_location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.predefined_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.predefined_location_id_seq OWNER TO postgres;

--
-- Name: predefined_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.predefined_location_id_seq OWNED BY public.predefined_location.id;


--
-- Name: user_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_location (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    coordinates public.geometry(Point,4326) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now(),
    "prevUserLocationId" integer,
    "nextUserLocationId" integer
);


ALTER TABLE public.user_location OWNER TO postgres;

--
-- Name: user_location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_location_id_seq OWNER TO postgres;

--
-- Name: user_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_location_id_seq OWNED BY public.user_location.id;


--
-- Name: predefined_location id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predefined_location ALTER COLUMN id SET DEFAULT nextval('public.predefined_location_id_seq'::regclass);


--
-- Name: user_location id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_location ALTER COLUMN id SET DEFAULT nextval('public.user_location_id_seq'::regclass);


--
-- Data for Name: predefined_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.predefined_location (id, name, coordinates, "createdAt", "updatedAt") FROM stdin;
1	Athens	0101000020E610000064F4D5079BBB3740171CBE985AFE4240	2024-12-03 01:28:16.315612+02	2024-12-03 01:28:16.315612+02
2	Gibraltar	0101000020E6100000AE1FF3D97AD815C02A167602EB004240	2024-12-03 01:28:16.326045+02	2024-12-03 01:28:16.326045+02
3	London	0101000020E6100000C5047E9E812CBABFFB2016E703C14940	2024-12-03 01:28:16.326855+02	2024-12-03 01:28:16.326855+02
4	Panama	0101000020E61000001278768C217D54C09E6E672B45452140	2024-12-03 01:28:16.327436+02	2024-12-03 01:28:16.327436+02
5	MidPacific	0101000020E6100000EC82D6D6296866C010547E41FE0A3340	2024-12-03 01:28:16.328028+02	2024-12-03 01:28:16.328028+02
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: user_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_location (id, name, coordinates, "createdAt", "updatedAt", "prevUserLocationId", "nextUserLocationId") FROM stdin;
170	Paris	0101000020E6100000EBCB495D6FB90240ABDA6BCAE0684840	2024-12-02 04:15:58.742566+02	2024-12-02 05:50:25.761632+02	159	171
178	germany	0101000020E610000013F297CF1F7F23402B56AF505BC34840	2024-12-02 21:50:14.256493+02	2024-12-02 21:50:37.063232+02	177	179
171	Turkey Road	0101000020E610000007093569718D41408C7ADC4585344440	2024-12-02 05:50:25.761632+02	2024-12-02 21:58:52.916149+02	170	177
177	place2	0101000020E61000008FD63C3A3A0A37409FB0F9F5D9FB4740	2024-12-02 18:35:10.944072+02	2024-12-02 21:58:52.916149+02	171	178
181	asia	0101000020E6100000D7635DB824B1514030C2E94891494340	2024-12-02 22:35:06.805154+02	2024-12-02 22:35:06.805154+02	179	\N
179	Larisa	0101000020E6100000B3EDDFB5FE6F36405604E105EFCC4340	2024-12-02 21:50:37.063232+02	2024-12-02 22:35:06.805154+02	178	181
159	place	0101000020E61000004FC0E684DF46484012B58D6F8A1B4540	2024-12-02 03:04:34.911852+02	2024-12-03 01:35:04.011028+02	\N	170
\.


--
-- Name: predefined_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.predefined_location_id_seq', 5, true);


--
-- Name: user_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_location_id_seq', 181, true);


--
-- Name: user_location PK_37bfb01591406f0fefaed6799a0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_location
    ADD CONSTRAINT "PK_37bfb01591406f0fefaed6799a0" PRIMARY KEY (id);


--
-- Name: predefined_location PK_e780a007e710f426c1ef95342b6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predefined_location
    ADD CONSTRAINT "PK_e780a007e710f426c1ef95342b6" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

