import 'package:flutter/material.dart';
import 'package:portfolio/src/common_widgets/business_logo.dart';
import 'package:portfolio/src/utils/theme/color_app.dart';

class Avatar extends StatelessWidget {
  const Avatar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        shape: BoxShape.circle,
        gradient: AppColor.textBusinessGradient,
      ),
      height: 213,
      width: 213,
      child: const BusinessLogo(
        height: 150,
        width: 150,
        large: false,
      ),
    );
  }
}
