<?php

namespace AuctionSocket;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;



class AuctionWebSocket implements MessageComponentInterface
{
   protected $clients;

   public function __construct()
   {
      $this->clients = new \SplObjectStorage;
   }

   public function onOpen(ConnectionInterface $conn)
   {
      // store the new connection in $this->clients
      $this->clients->attach($conn);
      echo 'Socket onOpen';
   }

   public function onMessage(ConnectionInterface $from, $msg)
   {

      $message = json_decode($msg, true);
      if ($message['msg'] == 'maintain') {
         $from->send($msg);
      } else {
         foreach ($this->clients as $client) {            
            $client->send($msg);
         }
      }
   }

   public function onClose(ConnectionInterface $conn)
   {
      $this->clients->detach($conn);
      echo ('Socket onclose');
   }

   public function onError(ConnectionInterface $conn, \Exception $e)
   {
      $conn->close();
      echo ('Socket onError');
   }
}
