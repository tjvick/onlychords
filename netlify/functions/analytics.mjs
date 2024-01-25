function handler(req, context) {
  console.log("Hello there (as a log)!", req, context);

  return new Response("Hello there!");
}


export default handler;
