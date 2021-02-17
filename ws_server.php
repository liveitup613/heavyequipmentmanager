<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\Http\HttpServerInterface;
use AuctionSocket\AuctionWebSocket;

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/ws_server/WebSocket.php';


    $server = IoServer::factory(
        new HttpServer(
           new WsServer(
               new AuctionWebSocket()
           )
        ),
        8081
    );

    $server->run();