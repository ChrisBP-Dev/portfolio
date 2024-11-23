import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/shader_text_effect.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';

class AdminWrapList extends StatelessWidget {
  const AdminWrapList({
    required this.listWidget,
    required this.onCreateTap,
    required this.title,
    super.key,
  });

  final Widget listWidget;
  final String title;
  final void Function() onCreateTap;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          flexibleSpace: Container(
            height: kToolbarHeight,
            decoration: const BoxDecoration(
              gradient: AppColor.textBusinessGradient,
            ),
          ),
          pinned: true,
          leading: const SizedBox(),
          actions: [
            OutlinedButton(
              onPressed: onCreateTap,
              style: OutlinedButton.styleFrom(
                backgroundColor: Colors.white,
                side: BorderSide(
                  color: AppColor.textBusinessGradient.colors.first,
                ),
              ),
              child: ShaderTextEffect(
                text: title,
                gradient: AppColor.textBusinessGradient,
                style: context.bodySmall,
              ),
            ),
            gapW20,
          ],
        ),
        SliverList(
          delegate: SliverChildListDelegate.fixed([
            gapH20,
            listWidget,
            gapH39,
          ]),
        ),
      ],
    );
  }
}
