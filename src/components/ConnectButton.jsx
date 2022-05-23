import { useViewerConnection } from '@self.id/framework'
import { EthereumAuthProvider } from "@3id/connect";
function ConnectButton1() {
  const [connection, connect, disconnect] = useViewerConnection()

  return connection.status === 'connected' ? (
    <button
      onClick={() => {
        disconnect()
      }}>
      Disconnect ({connection.selfID.id})
    </button>
  ) : 'ethereum' in window ? (
    <button
      disabled={connection.status === 'connecting'}
      onClick={async () => {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        await connect(new EthereumAuthProvider(window.ethereum, accounts[0]))
      }}>
      Connect
    </button>
  ) : (
    <p>
      An injected Ethereum provider such as{' '}
      <a href="https://metamask.io/">MetaMask</a> is needed to authenticate.
    </p>
  )
}
export default ConnectButton1;