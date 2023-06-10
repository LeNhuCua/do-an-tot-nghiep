import React from "react";
import huongdandonhan from "../../../assets/images/huong-dan-do-size-nhan.jpg";
import huongdandovong from "../../../assets/images/bang-size-vong-pho-bien.jpg";
import Breadcrumb from "../../../components/customer/breadcrumb/Breadcrumb";
const ListBreadcrumb = [

    {
      name: "Hướng dẫn do kích cỡ",
    },
  ];
const SizeAway = () => {
  return (
    <div className="">
      <Breadcrumb ListBreadcrumb={ListBreadcrumb} />

      <div className="cs-container">
        <div>
          <h3 className="text-xl font-bold">
            HƯỚNG DẪN CÁCH ĐO SIZE TRANG SỨC CHÍNH XÁC NHẤT
          </h3>
        </div>
        <div>
          <h3 className="italic text-sm">
            Thông thường, khi chọn trang sức, khách hàng sẽ phải đến trực tiếp
            cửa hàng của Kim Thành.H để chọn mẫu mã và lấy size phù hợp với
            mình. Tuy nhiên, nhằm tạo điều kiện mua sắm thoải mái và tiện lợi
            cho khách hàng, Kim Thành.H đã triển khai hình thức đặt hàng online
            thông qua Hotline, Fanpage ,Website. Từ đây, khách hàng có thể dễ
            dàng đặt mua các sản phẩm chất lượng và phù hợp kích cỡ thông qua
            các kênh trực tuyến này. Dưới đây là chi tiết hướng dẫn đo size
            trang sức từ chúng tôi, quý khách hàng có thể thực hiện để đảm bảo
            chọn được kích thước trang sức phù hợp nhất!
          </h3>
        </div>
        <div>
          <div>
            <h3 className="italic text-lg bg-red-400 p-1 rounded-sm">
              HƯỚNG DẪN CÁCH ĐO SIZE TRANG SỨC NHẪN
            </h3>
            <p className="text-sm">
              Kim Thành.H sẽ hướng dẫn bạn cách đo size trang sức nhẫn thủ công
              tại nhà ,với những kinh nghiệm được chia sẻ trong bài, bạn có thể
              dễ dàng mua sắm nhẫn nữ , nhẫn nam , nhẫn cưới, nhẫn kim cương hay
              nhẫn đôi bằng hính thức online mà khôngphải lo ngại tình huống
              “ngón tay một đằng , nhẫn một nẻo”.
            </p>
            <h4 className="text-lg">
              Bảng đo size trang sức nhẫn thông dụng tên thị trường kim hoàn
            </h4>
            <div className="h-60 lg:h-80">
              <img
                className="h-full object-cover"
                src={huongdandonhan}
                alt="huongdandonhan"
                srcset=""
              />
            </div>
            <h4 className="text-lg">
              Những phương pháp đơn giản để đo size trang sức nhẫn tại nhà :
            </h4>
            <div>
              <h3 className="text-sm font-semibold">
                {" "}
                1. Đo size trang sức nhẫn bằng giấy và thước :
              </h3>
              <p>
                Bước 1: Chuẩn bị một cây thước, 1 cây kéo, 1 cây bút & một tờ
                giấy{" "}
              </p>
              <p>Bước 2: Cắt một mảnh giấy dài khoảng 10 cm và rộng 1 cm.</p>{" "}
              <p>
                Bước 3: Sử dụng đoạn giấy vừa cắt để quấn sát quanh ngón tay
                muốn đo.
              </p>{" "}
              <p>Bước 4: Đánh dấu điểm giao nhau.</p>{" "}
              <p>
                Bước 5: Tháo ra dùng thước đo chiều dài của đoạn giấy từ điểm
                đầu cho đến phần đánh dấu. Lấy kết quả đo được chia cho 3,14 sẽ
                ra đường kính của vòng tròn . Sau đó đối chiếu với bảng đo size
                trang sức nhẫn.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold">
                {" "}
                2. Đo size trang sức nhẫn bằng nhẫn cũ :
              </h3>
              <p>
                Bước 1: Chuẩn bị một dụng cụ đo (sợi dây/sợi chỉ/thước dây/tờ
                giấy ) và chiếc nhẫn cũ .
              </p>
              <p>
                Bước 2: Tiến hành đo đường kính phía trong của chiếc nhẫn cũ .
              </p>
              <p>
                Bước 3: Đối chiếu số mm của thước với kích trên bảng đo size
                trang sức nhẫn bên trên.
              </p>{" "}
            </div>
          </div>

          <div>
            <h3 className="italic text-lg bg-red-400 p-1 rounded-sm">
              HƯỚNG DẪN ĐO SIZE TRANG SỨC LẮC
            </h3>
            <p className="text-sm">
              Kim Thành.H sẽ mách nhỏ bạn cách đo size trang sức lắc thủ công
              tại nhà ,với những thông tin được chia sẻ dưới đây , bạn có thể dễ
              dàng mua sắm lắc tay nữ , lắc tay nam , lắc chân nữ ,lắc chân cho
              bé …bằng hính thức online một cách an tâm nhất mà không phải lo
              lắc đeo sẽ không thoải mái khi quá chật hay quá rộng .
            </p>
            <h4 className="text-lg">
              Bảng đo size trang sức lắc thông dụng tên thị trường kim hoàn
            </h4>
            <div className="h-60 lg:h-80">
              <img
                className="h-full object-cover"
                src={huongdandovong}
                alt="huongdandonhan"
                srcset=""
              />
            </div>
            <h4 className="text-lg">
              Những phương pháp đơn giản để đo size trang sức vòng tại nhà :
            </h4>
            <div>
              <h3 className="text-sm font-semibold">
                {" "}
                1.    Đo size trang sức bằng mẫu vòng tay cũ sẵn có :
              </h3>
              <p>Bước 1: Đo đường kính bên trong chiếc vòng , lưu ý , số đo được tính bằng mm ( milimet).</p>
              <p>
              Đối chiếu kích thước đo được với bảng đo size trang sức vòng tay ở trên.
              Theo đó , kích thước số vòng tay mà bạn đo được sẽ đúng với số size sản phẩm được ghi trên bảng đo .Ví dụ như , đường kính đo được của chiếc vòng cũ là 50mm thì khách hàng sẽ lấy vòng mới size 50.
              </p>{" "}
       

            </div>

            <div>
              <h3 className="text-sm font-semibold">
                {" "}
                2     Đo size trang sức vòng tay bằng thủ công :
              </h3>
              <p>
              Trong trường hợp không có vòng tay sẵn thì khách hàng có thể đo chu vi cổ tay để tính ra đường kính vòng , sau đó chọn kích thước vòng phù hợp
              </p>
              <p>
              Bước 2: Đo chiều dài dụng cụ đo , sau đó lấy số đo vừa đo được chia cho 3,14 sẽ ra đường kính của cổ tay .
              </p>
              <p>
              Bạn đối chiếu đường kính bạn vừa tính được (theo mm) với bảng đo size trang sức vòng tay bên trên. Kích thước vòng của bạn tương ứng với số size ghi bên dưới vòng tròn.
              </p>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeAway;
